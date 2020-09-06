
// whis will contain all the electron and nodeJS modules
window.exported = {};

const { dialog } = require('electron').remote;
window.exported.dialog = dialog;

const exec = require('child_process').exec;
window.exported.exec = exec;

window.addEventListener('DOMContentLoaded', () => {

  console.log('DOMContentLoaded event');

});
