//renderer.js
const ipcRenderer = require('electron').ipcRenderer;
const smule = require('smule-api');
var ProgressBar = require('progressbar.js');
// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

var bar = new ProgressBar.Circle(container, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#aaa', width: 2 },
  to: { color: '#65FF00', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value);
    }

  }
});
bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar.text.style.fontSize = '2rem';
bar.animate(0);

const currentWindow = require('electron').remote.getCurrentWindow();
const responseParagraph = document.getElementById('response')

let songName;

const submitFormButton = document.querySelector("#ipcForm2");
submitFormButton.addEventListener("submit", function(event) {
	let link = document.getElementById("link").value;
	// let dest = document.getElementById("file-asm-path").files.path;
	songName = link.split('/')[4];
	console.log("form submit");

getLink(link, songName);

	event.preventDefault() // stop the form from submitting
});
ipcRenderer.on('dl-done', function(event, data) {
	console.log(data);
	bar.animate(data, {
		duration: 800
	}, function() {
		console.log('Music Smooled');
	});
});

function getLink(url, sname) {
	smule.source(url).then(res => {

		console.log("FILENAME :", sname);
		var song = sname + ".m4a";
		ipcRenderer.send('dlSong', song, res)
	});
}
