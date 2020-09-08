import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import React from "react";
import {FaCog, FaSearchengin} from "react-icons/fa";


class Header extends React.Component {

    render() {
        return (<div id="title-bar">
            <div id="title">
                <h4 style={{verticalAlign: 'middle', marginTop: 5}}>
                    <FaSearchengin style={{color: 'white', marginRight: 10}} size={25}/>
                    Git Search</h4>
            </div>
            <div id="title-bar-btns">
                <FaCog style={{color: 'white', marginRight: 10}} size={20}/>
                <ButtonGroup aria-label="Basic example">
                    <Button size="sm" variant="outline-dark">-</Button>
                    <Button size="sm" variant="outline-dark">+</Button>
                    <Button size="sm" variant="outline-dark">x</Button>
                </ButtonGroup>
            </div>
        </div>);
    }
}

export default Header;
