import React from 'react';
import './App.css';

import Utils from './scripts'
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const exec = window?.exported?.exec;
const dialog = window?.exported?.dialog;


class App extends React.Component {

    defaultState = {
        directories: null,
        searchString: '',
        lines: [],
        repositoryPaths: []
    };

    state = {
        ...this.defaultState
    };

    render() {

        let bashPath = '\"C:\\Program Files\\Git\\bin\\sh.exe\"';

        var selectRepoFolder = () => {

            dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}).then((args) => {
                console.log(args);

                if (args.canceled) {
                    return;
                }

                console.log('filepath selected: ', args.filePaths);

                args.filePaths.forEach((path) => {
                    let repositoryPath = Utils.convertWinToUnixFolder(path);
                    console.log('filepath converted:', repositoryPath);

                    exec(bashPath + ' --login -c \" cd ""' + repositoryPath + '"" && git remote -v \"', (error, stdout, stderr) => {

                        let directories = this.state.directories ? this.state.directories : [];

                        directories.push({
                            repositoryPath,
                            error: stderr ? stderr : null,
                            gitRemote: stdout ? stdout : null
                        });

                        this.setState(() => ({directories: directories}));

                    });

                });

            });
        };

        let handleSearchChange = (event) => {
            this.setState({searchString: event.target.value});
        };

        let search = (e) => {
            if ((e.key === 'Enter') && this.state.searchString) {

                console.log('Searching for: ', this.state.searchString);

                exec(bashPath + ' --login -c \" cd ""' + this.state.directories[0].repositoryPath + '"" && git branch -a | tr -d \\* | sed \'/->/d\' | xargs git grep -n -I ""' + this.state.searchString + '""', (error, stdout, stderr) => {
                    if (stderr) {
                        this.setState(() => ({
                            errorRepository: stderr,
                            outputRepository: ''
                        }));
                    } else {

                        let lines = stdout.split('\n');

                        lines.map(line => {
                            let tokens = line.split(':');
                            tokens.pop();
                            return tokens.join(':');
                        })

                        this.setState(() => ({
                            lines: lines
                        }));
                    }
                });
            }
        };

        let getElement = (dir) => {
            return (<OverlayTrigger
                key={dir}
                placement='bottom'
                overlay={
                    <Tooltip id={`tooltip-${dir}`}>
                        <strong style={{color: dir.error ? 'red' : 'green'}}>{dir.gitRemote || dir.error}</strong>
                    </Tooltip>
                }
            >
                <Alert
                    variant={(() => (dir.error ? 'danger' : 'success'))()}>{dir.repositoryPath}</Alert>
            </OverlayTrigger>)
        };

        return (

            <Container>
                <div>
                    <h2>Git Search <Button variant="outline-primary" id="selectFolderButton"
                                           onClick={selectRepoFolder}>+</Button></h2>
                    <hr/>
                    {
                        !this.state.directories &&
                        <h5 style={{textAlign: 'center'}}>Add repositories to search into</h5>
                    }
                    {
                        this.state.directories &&
                        <Row>
                            <Col md="6">

                                {
                                    this.state.directories.filter((value, index) => (
                                        index % 2 === 0)).map(dir => getElement(dir))
                                }

                            </Col>

                            <Col md="6">

                                {
                                    this.state.directories.filter((value, index) => (
                                        index % 2 !== 0)).map(dir => getElement(dir))
                                }

                            </Col>
                        </Row>
                    }
                </div>

                <hr/>

                <div>
                    <h2>Search text in all branches</h2>
                    <input id="searchText" type="text" value={this.state.searchString} onChange={handleSearchChange}
                           onKeyPress={search}/>
                </div>

                <ul>
                    {this.state.lines.map((value, index) => {
                        return <li key={index}>{value}</li>
                    })}
                </ul>

                <div>
                    <h3>Git Executable: <input type="text" id="bashPath"/></h3>
                </div>
            </Container>)
    }
}

export default App;
