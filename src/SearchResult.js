import React, {useCallback} from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import './SearchResult.css'
import EventBus from "./services/EventBus";
import Button from 'react-bootstrap/Button'
import Modal from "react-bootstrap/Modal";

const exec = window?.exported?.exec

import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

class SearchResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {show: false, text: '', file: '', repo: '', searchString: this.props.searchString};
        this.clickOnResult = this.clickOnResult.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.modalSearch = this.modalSearch.bind(this);
        this.download = this.download.bind(this);
        this.codeDivRef = React.createRef();
    }

    handleClose() {
        this.setState(() => ({
            show: false,
            text: '',
            file: '',
            repo: '',
            searchString: this.props.searchString
        }));
    }

    modalSearch(e) {
        if (e) {
            this.setState({searchString: e.target.value})
        }
        if (!this.state.searchString) {
            this.setState({searchString: this.props.searchString})
        }

        let object = this.codeDivRef.current;
        for (let span of object.children[0].children[0].children) {
            if (span.textContent.includes(this.state.searchString || this.props.searchString)) {
                console.log(span.textContent)
                span.style.backgroundColor = 'yellow'
            } else {
                span.style.backgroundColor = ''
            }
        }

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

    download() {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.text));
        element.setAttribute('download', this.state.file.split(':')[1]);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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


                <Modal show={this.state.show} onHide={this.handleClose} size={'xl'} onShow={this.modalSearch}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.repo}</Modal.Title>
                        <Button style={{marginLeft: 20}} id="downloadButton" variant="dark"
                                onClick={this.download}>Download</Button>
                    </Modal.Header>
                    <Modal.Body>

                        <h5 style={{lineBreak: "anywhere"}}>{this.state.file}</h5> <input type="text" className="input"
                                                                                          onChange={this.modalSearch}
                                                                                          value={this.state.searchString}
                                                                                          placeholder="Search..."/>

                        <div ref={this.codeDivRef}>
                            <SyntaxHighlighter language="javascript" style={docco} wrapLongLines={true}
                                               showLineNumbers={true}>
                                {this.state.text}
                            </SyntaxHighlighter>
                        </div>

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
