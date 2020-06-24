import React, { Component } from 'react';
import axios from "axios";
import { Typography, Button } from '@material-ui/core';
import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core'

class SlideRole extends Component {
    constructor(props){
        super(props)
        this.state={
            //Project Info
            project_id: this.props.project,
            title: null,
            description: null,
            requirements: null,
            payment: null,
            //Credentials
            username: this.props.username,
            token: this.props.token
        }
        this.clickHandler=this.clickHandler.bind(this);
        this.fetchProjectInfo=this.fetchProjectInfo.bind(this);
    }

    fetchProjectInfo(project_id){
        if(this.state.project_id>0){
            axios.get('http://localhost:80/api/Role/'+this.state.project_id+'/'+this.state.token)
            .then(res=>{
                this.setState({title: res.data[0].title, description: res.data[0].description, requirements: res.data[0].requirements, payment: res.data[0].payment})
            })
            .catch(err => console.error(err))
        }else{
            this.setState({title: null, description: null, requirements: null, payment: null})
        }
    }

    clickHandler = (event) => {
        this.props.onSelect(this.state.project_id)
    }

    componentDidMount(){
        this.fetchProjectInfo(this.state.project_id)
    }

    render(){
        let content = ''
        let t = <div onClick={this.clickHandler} style={{ backgroundColor: 'gray',  width: '80%', marginLeft: '10%', height: this.props.height*0.75  }}>
        <h1>title: {this.state.title}</h1><br />
        <p>description: {this.state.description}</p>
        <p>Bezahlung: {this.state.payment}</p>
    </div>
        if(this.state.title){
            content = <Card
            variant="outlined"
            >
                <CardHeader title={"Titel: "+this.state.title}/>
                <CardContent>
                    <Typography variant="caption" component="p">
                        {this.state.description}
                    </Typography>
                    <Typography variant="caption" component="p">
                        Bezahlung: {this.state.payment}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                    variant="outlined"
                    onClick={this.clickHandler}
                    >
                        Anzeigen
                    </Button>
                </CardActions>
            </Card>
        }else{
            content = <div style={{ backgroundColor: 'gray',  width: '80%', marginLeft: '10%', height: this.props.height*0.75  }}>
                <h1>Leider haben wir keine neuen Projekte für Sie</h1>
            </div>
        }
        return content
    }
}

export default SlideRole;