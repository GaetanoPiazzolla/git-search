import React from 'react';

import './App.css';
import Utils from './scripts'

import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Header from "./Header";
import SearchResult from "./SearchResult";

const exec = window?.exported?.exec;
const execSync = window?.exported?.execSync;
const dialog = window?.exported?.dialog;

class App extends React.Component {

    defaultState = {
        directories: null,
        searchString: '',
        searchResults: []
    };

    state = {
        ...this.defaultState
    };

    render() {
        let bashPath = '\"C:\\Program Files\\Git\\bin\\sh.exe\"';
        //
        // const dir = '/c/workspace_reca_new/alert';
        // const searchString = 'string';
        // const command = bashPath + ' --login -c \" cd ""' + dir + '"" ' +
        //     '&& git branch -a | ' +
        //     'tr -d \\* | sed \'/->/d\' | ' +
        //     'xargs git grep -n -I ""' + searchString + '""';
        //
        // try {
        //     let output = execSync(command);
        //     console.log('output ',output.toString())
        // }
        // catch(exception)
        // {
        //     console.error('errore', exception.message);
        // }


        let selectRepoFolder = () => {

            dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}).then((args) => {
                console.log(args);

                if (args.canceled) {
                    return;
                }

                console.log('filepath selected: ', args.filePaths);

                args.filePaths.forEach((path) => {

                    let repositoryPath = Utils.convertWinToUnixFolder(path);
                    console.log('filepath converted:', repositoryPath);

                    let output, error;
                    try {
                        output = execSync(bashPath + ' --login -c \" cd ""' + repositoryPath + '"" && git remote -v \"');
                    } catch (errorthrown) {
                        error = errorthrown.message;
                    }

                    let directories = this.state.directories ? this.state.directories : [];

                    directories.push({
                        repositoryPath,
                        error: error ? error : null,
                        gitRemote: output ? output.toString() : null
                    });

                    this.setState(() => ({directories: directories}));

                });
            });

        };

        let handleSearchChange = (event) => {
            this.setState({searchString: event.target.value});
        };

        let removeRepo = (dir) => {
            let newDirs = this.state.directories.filter((dirIn) => {
                return dirIn !== dir
            });
            this.setState(() => ({directories: newDirs}));
        };

        let keyPressSearch = (e) => {
            this.setState(() => ({searchResults: []}));
        };

        let search = () => {

            if (this.state.searchString) {

                console.log('Searching for: ', this.state.searchString);

                this.state.directories.forEach((directory) => {

                    if (directory.error) {
                        return;
                    }

                    const dir = directory.repositoryPath;

                    const command = bashPath + ' --login -c \" cd ""' + dir + '"" ' +
                        '&& git branch -a | ' +
                        'tr -d \\* | sed \'/->/d\' | ' +
                        'xargs git grep -n -I ""' + this.state.searchString + '""';

                    let output;
                    try {
                        output = execSync(command);
                    } catch (e) {
                        console.error(e.message);
                        return;
                    }

                    console.log('searched for', this.state.searchString);

                    if (output) {
                        let lines = output.toString().split('\n');
                        lines.map(line => {
                            let tokens = line.split(':');
                            tokens.pop();
                            return tokens.join(':');
                        });

                        let newResults = this.state.searchResults;
                        newResults.push({
                            repo: dir,
                            lines: lines
                        });
                        this.setState(() => ({searchResults: newResults}));
                    }
                })

            }
        };

        let renderDirectories = () => {

            if (this.state.directories)

                return (<>
                    <Row>

                        <Col md="6">
                            {
                                this.state.directories.filter((value, index) => (
                                    index % 2 === 0 && index < 8)).map(dir => getRepoElement(dir))
                            }
                        </Col>

                        <Col md="6">
                            {
                                this.state.directories.filter((value, index) => (
                                    index % 2 !== 0 && index < 8)).map(dir => getRepoElement(dir))
                            }
                        </Col>

                        <hr/>

                    </Row>
                    {
                        this.state.directories.length >= 8 && <div><h5 style={{textAlign: 'right'}}>... more</h5></div>
                    }
                </>);

        };

        let getLastChars = (path) => {
            if (path && path.length > 30) {
                return '...' + path.slice(path.length - 30);
            } else {
                return path;
            }
        };

        let getRepoElement = (dir) => {

            return (
                <OverlayTrigger
                    key={dir}
                    placement='bottom'
                    overlay={
                        <Tooltip id={`tooltip-${dir}`}>
                            <strong
                                style={{color: dir.error ? 'red' : 'green'}}>{dir.gitRemote || dir.error}</strong>
                        </Tooltip>
                    }
                >
                    <Alert style={{whiteSpace: 'nowrap'}} dismissible onClose={() => removeRepo(dir)}
                           variant={(() => (dir.error ? 'danger' : 'success'))()}>{getLastChars(dir.repositoryPath)}</Alert>
                </OverlayTrigger>)

        };

        return (
            <>
                <Header/>

                <Container fluid>

                    <div>

                        <h5 style={{textAlign: 'center'}}>
                            <Button id=" selectFolderButton" variant="dark" onClick={selectRepoFolder}>Add</Button>Repositories
                        </h5>
                        <hr/>

                        {renderDirectories()}

                    </div>

                    <div>
                        <InputGroup className="mb-3">
                            <FormControl
                                style={{textAlign: 'center'}}
                                placeholder="Search..."
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                type="text"
                                value={this.state.searchString}
                                onChange={handleSearchChange}
                                onKeyPress={keyPressSearch}
                            />
                            <Button id="search" variant="dark" onClick={search}>search</Button>

                        </InputGroup>
                    </div>

                    <hr/>

                    <SearchResult results={this.state.searchResults}/>

                </Container>
            </>)
    }
}

export default App;
