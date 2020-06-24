import React, { Component } from 'react';
import axios from 'axios';
import Card from '@material-ui/core/Card';

class RoleListItem extends Component {
    constructor(props){
        super(props)
        this.state={
            id: this.props.role_id,
            title: this.props.title,
            start_date: this.props.start_date,
            mode: this.props.mode,
            token: this.props.token,
            username: this.props.username
        }
        this.clickHandler=this.clickHandler.bind(this);
    }

    clickHandler = (event) => {
        if(this.state.mode==="left")
            this.props.handleClick(this.state.id);
        else if(this.props.type==="f")
            axios.delete('http://localhost:80/api/Application/'+this.state.id+'/'+this.state.username+'/'+this.state.token)
            .then(res=>this.props.onChange())
            .catch(err => console.log(err))

    }


    render(){
        let delBtn = ''
        if(this.state.mode!=="left")
        delBtn = <button onClick={this.clickHandler}>Löschen</button>
        let date = ''
        if(this.state.start_date)
        date = <p>Start: {this.state.start_date.substring(8,10)}.{this.state.start_date.substring(5,7)}.{this.state.start_date.substring(0,4)}</p>
        let t = <div onClick={this.clickHandler} style={{backgroundColor: 'gray'}}>
        <h3>{this.state.title}</h3>
        {date}
        {delBtn}
        </div>
        return (
            <Card style={{minWidth: 275}} 
            variant="outlined">
                
            </Card>
        )
        
        
    }
}
export default RoleListItem;