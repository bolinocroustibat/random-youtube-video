window.onload = () => {
	fetch('config.json')
		.then(response => response.json())
		.then(config => {
			getNewVideo(config.youtubeAPIkey)
			document.getElementById("try-again").addEventListener("click", function () {
				getNewVideo(config.youtubeAPIkey)
			})
		})
}

async function getNewVideo(ytAPIkey) {

	let ytSearchString = await getRandomWord()

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
				console.log(response)
				launchPlayer(ytSearchString, null) // launch player without any YouTube ID, hopefully it will get one ID from the already requested ones
				throw new Error("Bad YouTube response. Cannot parse.")
			}
		})
		.then((responseJson) => {
			if (responseJson.items.length) {
				const items = responseJson.items
				// take a video from the fresh response, not from the cache
				const item = items[Math.floor(Math.random() * items.length)]
				// we got a response so we will store all the ids in the localStorage list of YouTube Ids
				// first, delete the video we just took from the list of videos to stores, so we won't watch it again
				delete items.item
				// retrieve the localStorage (or create a blank array if there isn't any info saved yet)
				let youtubeIds = JSON.parse(localStorage.getItem('youtubeIds')) || []
				items.forEach(item => {
					youtubeIds.push(item.id.videoId)
				})
				// then put it back with ytSearchString as key
				localStorage.setItem('youtubeIds', JSON.stringify(youtubeIds))
				// finally, launch the player with the ID
				launchPlayer(item.id.videoId)
			} else {
				console.log("Couldn't read YouTube search response.")
				launchPlayer(null) // launch player without any YouTube ID, hopefully it will get one ID from the already requested ones
			}
		})
		.catch((error) => {
			console.log(error)
		})
}

function launchPlayer(ytId) {
	if (!ytId) {
		let youtubeIds = JSON.parse(localStorage.getItem('youtubeIds'))
		if (youtubeIds.length) {
			console.log("Getting video ID from already requested list in local storage.")
			ytId = youtubeIds[Math.floor(Math.random() * youtubeIds.length)]
			delete youtubeIds.ytId // don't watch it a second time
			localStorage.setItem('youtubeIds', JSON.stringify(youtubeIds))
		} else {
			throw new Error("Cannot get any YouTube ID.")
		}
	}
	document.getElementById("yt").src = '//www.youtube.com/embed/' + ytId + '?rel=0'
}

function getRandomString() {
	const codeLength = 5
	const possibles = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_"
	let code = "";
	for (let i = 0; i < codeLength; i++) {
		code += possibles.charAt(Math.floor(Math.random() * possibles.length))
	}
	return code
}

async function getRandomWord() {
	const file = await fetch('dict_EN.txt')
	const text = await file.text()
	const lines = text.split("\n")
	const randLineNum = Math.floor(Math.random() * lines.length)
	return lines[randLineNum]
}
