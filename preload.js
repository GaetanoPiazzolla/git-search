// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { dialog } = require('electron').remote;
window.electron = {};
window.electron.dialog = dialog;

window.addEventListener('DOMContentLoaded', () => {

  console.log('DOMContentLoaded event');

});
