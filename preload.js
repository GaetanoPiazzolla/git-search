console.log('preloading start')

window.exported = {};

const electronRemote = require('@electron/remote')
window.exported.dialog = electronRemote.dialog;
window.exported.getCurrentWindow = electronRemote.getCurrentWindow;

const childProcess = require('child_process');
window.exported.exec = childProcess.exec;
window.exported.execSync = childProcess.execSync;

const spawn = require('child_process').spawn;
window.exported.spawn = spawn;

const path = require('path')
window.exported.path = path;

console.log('preloading end')