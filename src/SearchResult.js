import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import './SearchResult.css'
import EventBus from "./services/EventBus";
import Button from 'react-bootstrap/Button'
import Modal from "react-bootstrap/Modal";

const exec = window?.exported?.exec

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class SearchResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {show: false, text: '', file: '', repo: ''};
        this.clickOnResult = this.clickOnResult.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState(() => ({
            show: false,
            text: '',
            file: '',
            repo: ''
        }));
    }

    clickOnResult(repositoryPath, searchResult) {
        EventBus.getInstance().fireEvent("LOADING", true)
        let bashPath = '\"C:\\Program Files\\Git\\bin\\sh.exe\"'
        const branch_file = searchResult.split(':').slice(0, 2).join(':')
        console.log('clicked on file: ', branch_file)
        exec(bashPath + ' --login -c \" cd ""' + repositoryPath + '"" && git show ' + branch_file + ' \"', {windowsHide: true}, (err, stdout, stderr) => {
            console.log(stdout)

            this.setState(() => ({
                show: true,
                text: stdout,
                file: branch_file,
                repo: repositoryPath
            }));

            EventBus.getInstance().fireEvent("LOADING", false)
        })
    }

    render() {
        return (
            <>
                <Tabs>
                    {this.props.results.map((result) => {
                        return (
                            <Tab eventKey={result.repo} title={result.repo}>
                                <ul>
                                    {result.lines.map((value, index) => {
                                        return <li className={'file'}
                                                   onClick={this.clickOnResult.bind(this, result.repo, value)}
                                                   key={index}>{value}</li>
                                    })}
                                </ul>
                            </Tab>
                        )
                    })}
                </Tabs>


                <Modal show={this.state.show} onHide={this.handleClose} size={'xl'}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.repo}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>{this.state.file}</h5>

                        <SyntaxHighlighter language="javascript" style={docco}>
                            {this.state.text}
                        </SyntaxHighlighter>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </>
        )
    }

}


export default SearchResult;
