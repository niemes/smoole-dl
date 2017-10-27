const {
	app,
	Menu,
	BrowserWindow,
	ipcMain,
	ipcRenderer
} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const {
	download
} = require('electron-dl');
let win;
let window;

function createWindow() {
	window = new BrowserWindow({
		width: 560,
		height: 320,
		show: true,
		icon: __dirname + '/Bluetooth.ico',
		fullscreen: false,
		resizable: false
	});
	window.loadURL(`file://${__dirname}/index.html`);
	window.once('ready-to-show', function() {
		window.show();
	});

	// window.webContents.openDevTools();

	let contents = window.webContents;

	window.on('closed', function() {
		window = null;
	});

}

ipcMain.on('dlSong', (event, songName, url, path) => {
			download(window, url, {
					filename: songName,
					directory: path,
					errorTitle: "Probleme dlSong",
					errorMessage: "Url non valide",
					onProgress: (percent) => {
						event.sender.send('dl-done', percent)
					},
						openFolderWhenDone: true
					}).then(dl =>
					console.log(dl.getSavePath()))
				.catch(console.error);
			});

		app.on('ready', function() {
			createWindow();
			    // Create the Application's main menu
    var template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
		});
