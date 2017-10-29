const ipcRenderer = require('electron').ipcRenderer;
const smule = require('smule-api');

var target = document.getElementById('spinne');
var response = document.getElementById('response');
target.style.opacity = "0";
// progressbar

const currentWindow = require('electron').remote.getCurrentWindow();
const responseParagraph = document.getElementById('response');
const submitFormButton = document.querySelector("#ipcForm2");

submitFormButton.addEventListener("submit", function(event) {

	let link = document.getElementById("link").value;
	let desti = document.getElementById("path").files;
	let songName = link.split('/')[4];
	var checklink = link.indexOf("http");

	if (checklink !== -1) {
		if (desti.length !== 0) {
			let path = document.getElementById("path").files[0].path;
			event.preventDefault(); // stop the form from submitting
			percent.innerHTML = 0 + "%";
			// target.style.opacity = "1";
			fileType(link, songName, path);
		} else response.innerHTML = "*Destination Folder."
	} else response.innerHTML = "Not a valid link." // reflow Bug

});

ipcRenderer.on('dl-done', function(event, data) {
	percent.innerHTML = data + "%";
	response.innerHTML = 'Music Smooled';
});

function fileType(url, Sname, filepath) {

	smule.type(url).then(res => {
		console.log(res);
		if (res !== "Response code 404 (Not Found)" && res !== "undefined" && res.indexOf("ENOTFOUND") == -1) {
			target.style.opacity = "0";
			response.innerHTML = "Processing..."
			if (res == "video/mp4") return getLink(url, Sname + ".mp4");
			else return getLink(url, Sname + ".m4a", filepath);
		} else {
			response.innerHTML = "Link is not Valid.";
			setTimeout(() => {
				target.style.opacity = "0";
			}, 1000)
		}
	})
	
}

function getLink(url, sname, filepath) {
	smule.source(url).then(res => {
		console.log("FILENAME :", sname);
		var song = sname;
		ipcRenderer.send('dlSong', song, res, filepath)
	});
}
