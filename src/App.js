import React from 'react';
import './App.css';
const exec = require('child_process').exec;

const dialog = window?.electron?.dialog;

class App extends React.Component {

    defaultState = {
        opened: true,
        positionTop: '0px'
    };

    state = {
        ...this.defaultState
    };

    render() {

        var selectRepoFolder = function() {

            dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}).then( (args) => {
                console.log(args);
            });
        };

        return (
            <div>
                <div>
                    <h2>Select a git repository</h2>
                    <button id="selectFolderButton" onClick={selectRepoFolder}>SELECT REPO FOLDER</button>
                    <span id="sourceDirPath"></span>
                </div>

                <div>
                    <hr/>
                    <span id="outputRemote"></span>
                    <span id="errorRemote"></span>
                    <hr/>
                </div>

                <div>
                    <h2>Search text in all branches</h2>
                    <input id="searchText" type="text"/>
                </div>

                <div>
                    <ul id="list">

                    </ul>
                </div>

                <div>
                    <h3>Git Executable: <input type="text" id="bashPath"/></h3>
                </div>
            </div>)
    }
}

export default App;
