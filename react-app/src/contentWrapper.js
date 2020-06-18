import React, { Component } from 'react';

import MainContent from './common/mainContent';
import Footer from './common/Footer';
import Header from './common/Header';

class ContentWrapper extends Component{
    constructor(props){
        super(props)
        this.state={
            auth: null,
            username: null,
            toSettings: false
        }
        this.handleLogin=this.handleLogin.bind(this);
        this.handleSettings=this.handleSettings.bind(this);
    }

    handleLogin = (event) => {
        console.log(event)
        this.setState({auth: event, username: event['username']})
    }

    handleSettings = (event) => {
        console.log("handeling settings")
        this.setState({toSettings: true})
    }



    render(){
        console.log(this.state)
        return (
        <div>
            <Header user={this.state.username} onSettings={this.handleSettings}/>
            <MainContent onLogin={this.handleLogin} goToSettings={this.state.toSettings}></MainContent>
            <Footer ></Footer>
        </div>
        )
    }
}

export default ContentWrapper;