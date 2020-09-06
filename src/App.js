import React from 'react';
import './App.css';

import Utils from './scripts'

const exec = window?.exported?.exec;
const dialog = window?.exported?.dialog;

class App extends React.Component {

    defaultState = {
        directorySelected : '',
        outputRepository : '',
        errorRepository: '',
        searchString :'',
        lines: [],
        repositoryPaths: []
    };

    state = {
        ...this.defaultState
    };

    render() {

        let bashPath = '\"C:\\Program Files\\Git\\bin\\sh.exe\"';

        let selectRepoFolder  = () => {

            dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}).then( (args) => {
                console.log(args);

                if (args.canceled) {
                    this.setState( () => ({
                        directorySelected: 'No directory selected'
                    }));
                    return;
                }

                console.log('filepath selected: ', args.filePaths);
                let repositoryPath = Utils.convertWinToUnixFolder(args.filePaths[0]);
                console.log('filepath converted:', repositoryPath);

                this.setState( () => ({
                    directorySelected: repositoryPath
                }));

                exec( bashPath + ' --login -c \" cd ""' + this.state.directorySelected + '"" && git remote -v \"', (error, stdout, stderr) => {
                    if (stderr) {
                        this.setState( () => ({
                            errorRepository: stderr,
                            outputRepository: ''
                        }));
                    } else {
                        this.setState( () => ({
                            errorRepository: '',
                            outputRepository: stdout
                        }));
                    }
                });



            });
        };

        var handleSearchChange = (event) => {
            this.setState({searchString: event.target.value});
        };

        var search = (e) => {
            if ((e.key === 'Enter' ) && this.state.searchString) {

                console.log('Searching for: ',this.state.searchString);

                exec(bashPath + ' --login -c \" cd ""' + this.state.directorySelected + '"" && git branch -a | tr -d \\* | sed \'/->/d\' | xargs git grep -n -I ""'+this.state.searchString+'""', (error, stdout, stderr) => {
                    if (stderr) {
                        this.setState( () => ({
                            errorRepository: stderr,
                            outputRepository: ''
                        }));
                    } else {

                        let lines = stdout.split('\n');

                        lines.map( line => {
                            let tokens = line.split(':');
                            tokens.pop();
                            return tokens.join(':');
                        })

                        this.setState( () => ({
                            lines: lines
                        }));
                    }
                });
            }
        };

        return (
            <div>
                <div>
                    <h2>Select a git repository</h2>
                    <button id="selectFolderButton" onClick={selectRepoFolder}>SELECT REPO FOLDER</button>
                    <span id="sourceDirPath">{this.state.directorySelected}</span>
                </div>

                <div>
                    <hr/>
                    <span id="outputRemote">{this.state.outputRepository}</span>
                    <span id="errorRemote">{this.state.errorRepository}</span>
                    <hr/>
                </div>

                <div>
                    <h2>Search text in all branches</h2>
                    <input id="searchText" type="text" value={this.state.searchString} onChange={handleSearchChange} onKeyPress={search}/>
                </div>

                <ul>
                    {this.state.lines.map((value, index) => {
                        return <li key={index}>{value}</li>
                    })}
                </ul>

                <div>
                    <h3>Git Executable: <input type="text" id="bashPath"/></h3>
                </div>
            </div>)
    }
}

export default App;
