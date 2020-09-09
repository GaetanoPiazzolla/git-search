import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

class SearchResult extends React.Component {

    render() {
        return (
            <>
                <Tabs>
                    {this.props.results.map((result) => {
                        return (
                            <Tab eventKey={result.repo} title={result.repo}>
                                <ul>
                                    {result.lines.map((value, index) => {
                                        return <li key={index}>{value}</li>
                                    })}
                                </ul>
                            </Tab>
                        )
                    })}
                </Tabs>

            </>
        )
    }

}


export default SearchResult;
