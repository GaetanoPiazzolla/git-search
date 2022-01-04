import React from "react";
import Loader from "react-loader-spinner";
import EventBus from "./services/EventBus";

class MyLoader extends React.Component {

    defaultState = {
        loading: false
    };

    state = {
        ...this.defaultState
    };

    componentDidMount() {
        EventBus.getInstance().addListener("LOADING", this.listener = this.changeLoading)
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.changeLoading)

    }

    changeLoading = (load) => {
        console.log('changeLoading received: ', load)
        this.setState({loading: load})
    }

    render() {

        return this.state.loading ?
            <div id={'loader'}><Loader visible={this.state.loading}
                         type="Audio"
                         color="#60FFA0"
                         height={200}
                         width={200}
                         timeout={0}/>
            </div> : <></>
    }


}


export default MyLoader;
