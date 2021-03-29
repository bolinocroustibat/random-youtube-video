function getRandomVideoSearch() {
	const codeLength = 5
	const possibles = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_"
	let code = "";
	for (let i = 0; i < codeLength; i++) {
		code += possibles.charAt(Math.floor(Math.random() * possibles.length))
	}
	return code
}

window.onload = () => {

	let ytAPIkey = ""
	let maxAttempts = 5

	fetch('config.json')
		.then(response => response.json())
		.then(data => {
			ytAPIkey = data.youtubeAPIkey
			maxAttempts = data.maxAttempts
		})

	var attempts = 0

	function getNewVideo() {
		attempts++

		if (attempts <= maxAttempts) {
			document.getElementById("try-again").disabled = true
			let ytSearchString = getRandomVideoSearch()

			const url = new URL("https://www.googleapis.com/youtube/v3/search")
			let params = {
				key: ytAPIkey,
				part: 'snippet',
				type: 'video',
				q: ytSearchString
			}

			url.search = new URLSearchParams(params).toString()

			fetch(url)
				.then((response) => {
					if (response.ok) {
						return response.json()
					} else {
						throw new Error('Something went wrong')
					}
				})
				.then((responseJson) => {
					if (responseJson.items.length) {
						const items = responseJson.items
						const ytId = items[Math.floor(Math.random() * items.length)].id.videoId
						document.getElementById("yt").src = '//www.youtube.com/embed/' + ytId + '?rel=0&autoplay=1'
						document.getElementById("try-again").disabled = false
					}
					else {
						getNewVideo()
					}
				})
				.catch((error) => {
					console.log(error)
				})
		} else {
			document.getElementById("try-again").disabled = false
		}
	}

	getNewVideo()

	document.getElementById("try-again").addEventListener("click", function () {
		getNewVideo()
	})

}
