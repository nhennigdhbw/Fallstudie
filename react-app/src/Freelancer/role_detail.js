import React, { Component } from 'react';
import axios from "axios";

class RoleDetail extends Component {
    constructor(props){
        super(props)
        this.state={
            role_id: this.props.role_id
        }
        this.style ={
            position: 'absolute',
            left: '15%',
            width: '70%',
            height: '100%'
        }
        this.handleBack=this.handleBack.bind(this);
    }

    handleBack = (event) =>{
        this.props.onBack()
    }

    render(){
        return <div style={this.style}>
            <button onClick={this.handleBack}>Zurück</button>
            <p>Ich informiere über Rolle: {this.state.role_id}</p>
        </div>
    }
}

export default RoleDetail;