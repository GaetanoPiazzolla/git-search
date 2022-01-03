import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import React from "react";
import {FaCog} from "react-icons/fa";
import logo192Invert from "./assets/logo192-invert.png"

const getCurrentWindow = window?.exported?.getCurrentWindow;

class Header extends React.Component {


    render() {

        let close = () => {
            getCurrentWindow().close()
        }

        let maximize = () => {
            getCurrentWindow().maximize()
        }

        let minimize = () => {
            getCurrentWindow().minimize()
        }

        return (<div id="title-bar">
            <div id="title">
                <h4 style={{verticalAlign: 'middle', marginTop: 5}}>
                    <img src={logo192Invert} width={30} />
                    Git Search</h4>
            </div>
            <div id="title-bar-btns">
                <FaCog style={{color: 'white', marginRight: 10}} size={20}/>
                <ButtonGroup aria-label="Basic example">
                    <Button size="sm" variant="outline-dark" onClick={minimize}>-</Button>
                    <Button size="sm" variant="outline-dark" onClick={maximize}>+</Button>
                    <Button size="sm" variant="outline-dark" onClick={close}>x</Button>
                </ButtonGroup>
            </div>
        </div>);
    }
}

export default Header;
