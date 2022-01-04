import React from 'react';

import './App.css';
import Utils from './services/Utils'

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
import EventBus from "./services/EventBus";
import MyLoader from "./MyLoader";

const execSync = window?.exported?.execSync;
const exec = window?.exported?.exec;
const dialog = window?.exported?.dialog;


class App extends React.Component {

    defaultState = {
        directories: [],
        searchString: '',
        searchResults: []
    };

    state = {
        ...this.defaultState
    };

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        console.log('rendering')

        let bashPath = '\"C:\\Program Files\\Git\\bin\\sh.exe\"';

        let selectRepoFolder = () => {

            dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}).then((args) => {
                console.log(args);

                if (args.canceled) {
                    return;
                }

                console.log('filepath selected: ', args.filePaths);


                EventBus.getInstance().fireEvent("LOADING", true)
                let filePathsNumber = args.filePaths.length;

                args.filePaths.forEach((p) => {

                    let repositoryPath = Utils.convertWinToUnixFolder(p);
                    console.log('filepath converted:', repositoryPath);

                    exec(bashPath + ' --login -c \" cd ""' + repositoryPath + '"" && git remote -v \"', {windowsHide: true}, (err, stdout, stderr) => {

                        console.log(stdout);

                        let directory = {
                            repositoryPath,
                            error: err ? err.toString() : null,
                            gitRemote: stdout ? stdout.toString() : null
                        };

                        this.setState((oldState) => (
                            {
                                ...oldState,
                                directories: [...oldState.directories, directory]
                            }));

                        filePathsNumber--;
                        if (filePathsNumber === 0)
                            EventBus.getInstance().fireEvent("LOADING", false)

                    });

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

            this.setState(() => (
                {
                    searchResults: []
                }));

            if (this.state.searchString) {

                console.log('Searching for: ', this.state.searchString);

                EventBus.getInstance().fireEvent("LOADING", true)
                let directoriesNumber = this.state.directories.length;

                this.state.directories.forEach((directory) => {

                    if (directory.error) {
                        return;
                    }

                    const dir = directory.repositoryPath;

                    const command = bashPath + ' --login -c \" cd ""' + dir + '"" ' +
                        '&& git branch -a | ' +
                        'tr -d \\* | sed \'/->/d\' | ' +
                        'xargs git grep -n -I ""' + this.state.searchString + '""';

                    exec(command, {windowsHide: true}, (err, stdout, stderr) => {

                        if (err) {
                            //TODO handle error of no results!
                            console.error(err);
                            directoriesNumber--;
                            if (directoriesNumber === 0)
                                EventBus.getInstance().fireEvent("LOADING", false)
                            return;
                        }

                        console.log('searched for', this.state.searchString);

                        if (stdout) {
                            let lines = stdout.toString().split('\n');
                            lines.map(line => {
                                let tokens = line.split(':');
                                tokens.pop();
                                return tokens.join(':');
                            });

                            let result = {
                                repo: dir,
                                lines: lines
                            };

                            this.setState((oldState) => (
                                {
                                    ...oldState,
                                    searchResults: [...oldState.searchResults, result]
                                }))
                        }
                        directoriesNumber--;
                        if (directoriesNumber === 0)
                            EventBus.getInstance().fireEvent("LOADING", false)

                    });


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
                <MyLoader/>

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
