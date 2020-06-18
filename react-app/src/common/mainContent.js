import React, { Component } from 'react';
import axios from "axios";

//Landing page imports
import Description from '../landing/description';
import Login from '../landing/login';
import Registration from '../landing/registration';
import login_background from '../media/login_background.jpg';  //'./media/login_background.jpg';

//Complete Profile
import CompleteProfile from '../CompleProfile/completeProfile';

//Home-Screen imports
import LeftBar from '../homeScreen/leftBar';
import RightBar from '../homeScreen/rightBar';
import Carousel from '../homeScreen/carousel';


//Freelancer-Only pages
import RoleDetail from '../Freelancer/role_detail';

//Company-Only pages
import ProjectDetail from '../Company/project_detail';
import ProjectCreate from '../Company/project_create';

class MainContent extends Component {
    constructor(){
        super();
        this.state = {
            Registration: false,
            login: false,             //Change to false, in develeopment to circumvent login (true)
            auth: null,
            content: null,
            leftContent: null,
            rightContent:null,
            settingsIsFreelancer: true,
            company_name: null,
            update: null,
            mainContent: null
        }
        this.style={position: 'absolute', 
                    top: '8%',
                    left: '0%',
                    height: '85%',
                    width: '100%', 
                    display: "flex", 
                    flexDirection:"row"                    
                }
        this.getBars=this.getBars.bind(this);
        this.handleApplied=this.handleApplied.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleCompanyComplete = this.handleCompanyComplete.bind(this);
        this.handleSettingsComplete = this.handleSettingsComplete.bind(this);
        this.handleRoleSelected=this.handleRoleSelected.bind(this);
        this.handleProjectSelected = this.handleProjectSelected.bind(this);
        this.handleRoleApplicationSelected=this.handleRoleApplicationSelected.bind(this);
        this.handleBackToHome=this.handleBackToHome.bind(this);
        this.handleProjectCreate = this.handleProjectCreate.bind(this);
        this.handleUpdate=this.handleUpdate.bind(this);
    }

    componentDidMount(){
        this.setState({content: this.getLogin()});
    }

    handleApplied = (event) => {
        console.log("application handle")
        this.setState({content:this.getHome()})
        this.getBars();
    }


    handleRegister = (event) => {
        this.setState({content: this.getRegistration()});
    }
    handleBack = (event) => {
        this.setState({content: this.getLogin()})
    }

    handleLogin = (event) => {
        this.setState({auth: event})
        this.props.onLogin(event)
        axios.get('http://localhost:80/api/User/'+this.state.auth['username'] + '/'+ this.state.auth['type'], this.state.auth)
        .then(data => {
            if(data.data['is_set']){
                let comp_id_new = data.data.comp_id
                this.setState({content: this.getHome(), comp_id: comp_id_new})
                this.getBars()
            }else{
                this.setState({content: this.getSettings(), settingsIsFreelancer:true})
            }
        })
        .catch(err => console.log(err))
    }

    handleCompanyComplete = (event) =>{
        this.setState({company_name:event, settingsIsFreelancer:false})
        this.setState({content: this.getSettings()})
    }

    handleSettingsComplete = (event) => {
        this.setState({content: this.getLogin()})
    }

    handleRoleSelected(id){
        console.log("changing to " + id)
        this.setState({content: null})
        let cont = this.getRoleDetail(id)
        this.getBars();
        this.setState({content: cont})
    }

    handleProjectSelected(id){
        this.getBars();
        this.setState({content: this.getProjectDetail(id)})
    }

    handleUpdate(){
        console.log("updating")
        this.setState({update: new Date()})
        if(this.state.mainContent==="h") this.setState({content: this.getHome()})
    }

    //not used
    handleRoleApplicationSelected(id){
        console.log("selected application: "+id)
    }

    handleBackToHome(){
        this.getBars();
        this.setState({content:this.getHome()})
    }

    handleProjectCreate(){
        this.getBars();
        this.setState({content: this.getProjectCreation()})
    }

    getSettings(isChange){
        let token = null
        if(this.state.auth&&isChange!==true) {
            token=this.state.auth['private']
            this.setState({settingsIsFreelancer:true})
        }
        else if(isChange!=true) this.setState({settingsIsFreelancer:false})
        else token=this.state.auth['private']
        this.setState({ mainContent: "s"})
        return <CompleteProfile isFreelancerSetting={this.state.settingsIsFreelancer} token={token} comp_name={this.state.company_name} userinfo={this.state.auth} isChange={isChange} onSubmit={this.handleSettingsComplete}></CompleteProfile>
    }

    getLogin(){
        let func = <Login onRegister={this.handleRegister} onLogin={this.handleLogin} />
        return <div id='backgroundImage' style={{backgroundImage: `url(${login_background})`}}>
                    <Description />
                    {func}
                </div>
    }

    getRegistration(){
        let func = <Registration onBack={this.handleBack} onCompanyComplete={this.handleCompanyComplete}/>
        return <div id='backgroundImage' style={{backgroundImage: `url(${login_background})`}}>
                    <Description />
                    {func}
                </div>
    }

    getBars(){
        let username = this.state.auth['username']
        let type=this.state.auth['type']
        let auth = this.state.auth['private']
        let comp_id = this.state.comp_id
        this.setState({update: new Date()})
        this.setState({leftContent: <LeftBar username={username} type={type} token={auth} comp_id={comp_id} update={this.state.update} onRoleSelect={this.handleRoleSelected} onProjectSelected={this.handleProjectSelected}/> })
        this.setState({rightContent: <RightBar username={username} type={type} token={auth} comp_id={comp_id} update={this.state.update} onApplicationSelect={this.handleRoleApplicationSelected} onChange={this.handleUpdate}/>})
    }

    getHome(){
        let username = this.state.auth['username']
        let type=this.state.auth['type']
        let auth = this.state.auth['private']
        let comp_id = this.state.comp_id
        this.setState({ mainContent: "h"})
        return <div>
                    <Carousel username={username} type={type} token={auth} comp_id={comp_id} update={this.state.update} onRoleSelect={this.handleRoleSelected} onProjectSelected={this.handleProjectSelected} onProjectCreate={this.handleProjectCreate}/>
                </div>
    }

    getRoleDetail(role_id){
        console.log("showing role"+role_id)
        let username = null
        let type='c'
        let auth = null
        let comp_id = this.state.comp_id
        username= this.state.auth['username']
        type=this.state.auth['type']
        auth= this.state.auth['private']
        this.setState({ mainContent: "rd"})
        return <div>
            <RoleDetail role_id={role_id} username={username} token={auth} onBack={this.handleBackToHome} onApply={this.handleApplied}></RoleDetail>
        </div>
    }

    getProjectDetail(project_id){
        let username = null
        let type='c'
        let auth = null
        let comp_id = this.state.comp_id
        username= this.state.auth['username']
        type=this.state.auth['type']
        auth= this.state.auth['private']
        this.setState({ mainContent: "pd"})
        return <div>
            <ProjectDetail project_id={project_id} token={auth} onBack={this.handleBackToHome}></ProjectDetail>
        </div>
    }

    getProjectCreation(){
        let username = this.state.auth['username']
        let auth = this.state.auth['private']
        let comp_id = this.state.comp_id
        this.setState({ mainContent: "pc"})
        return <div>
            <ProjectCreate username={username} token={auth} comp_id={comp_id} onBack={this.handleBackToHome}></ProjectCreate>
        </div>
    }

    render() {
        let lftcon = this.state.leftContent
        let cont = this.state.content
        let rghcon = this.state.rightContent
        return (
            <div id='MainContainer' style={this.style}>
                {lftcon}
                {cont}
                {rghcon}
            </div>
        )
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        console.log(this.state.mainContent)
        if(nextProps.goToSettings===true&&this.state.mainContent!=="s") this.setState({content: this.getSettings(true), leftContent: '', rightContent: ''})
    }
}
export default MainContent;