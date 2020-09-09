// whis will contain all the electron and nodeJS modules
window.exported = {};

const {dialog} = require('electron').remote;
window.exported.dialog = dialog;

const exec = require('child_process').exec;
window.exported.exec = exec;

const execSync = require('child_process').execSync;
window.exported.execSync = execSync;

const spawn = require('child_process').spawn;
window.exported.spawn = spawn;

window.addEventListener('DOMContentLoaded', () => {

    console.log('DOMContentLoaded event');

});




