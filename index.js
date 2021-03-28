function getRandomVideoSearch() {
	const codeLength = 5;
	const possibles = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
	let code = "";
	for (let i = 0; i < codeLength; i++) {
		code += possibles.charAt(Math.floor(Math.random() * possibles.length));
	}
	return code;
}

window.onload = (event) => {

	const ytAPIkey = "";
	const maxAttempts = 5;

	fetch('config.json')
		.then(response => response.json())
		.then(data => {
			ytAPIkey = data.youtubeAPIkey;
			maxAttempts = data.maxAttempts;
		});

	var attempts = 0;

	function getNewVideo() {
		attempts++;

		if (attempts <= maxAttempts) {
			document.getElementById("try-again").disabled = true;
			let ytSearchString = getRandomVideoSearch();
			$.ajax({
				type: 'GET',
				url: "https://www.googleapis.com/youtube/v3/search",
				crossDomain: true,
				data: {
					key: ytAPIkey,
					part: 'snippet',
					type: 'video',
					q: ytSearchString
				},
				error: function (response) {
					getNewVideo();
				},
				success: function (response) {
					if (response.items.length) {
						const items = response.items;
						const ytId = items[Math.floor(Math.random() * items.length)].id.videoId;
						document.getElementById("yt").src = '//www.youtube.com/embed/' + ytId + '?rel=0&autoplay=1';
						document.getElementById("try-again").disabled = false;
					}
					else {
						getNewVideo();
					}
				},
			});
		} else {
			document.getElementById("try-again").disabled = false;
		}
	}

	getNewVideo();

	document.getElementById("try-again").addEventListener("click", function () {
		getNewVideo();
	});

};
