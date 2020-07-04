const express = require('express');

const db_project = require('../modules/db_utils_project')
const auth_utils = require('../modules/auth_utils')

router = express.Router();

//Gibt alle Projekte einer Firma aus, zu der der User account gehört
router.get('/:comp_user/:token', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    
    db_project.getAllProjects(req.params.comp_user)
    .then(data => res.send(data))
    .catch(err => {res.status(500).send(err)})
})

//Gibt alle Projekte einer Firma aus, zu der der User account gehört und deren Bewerbungsfrist noch nicht abgelaufen ist
router.get('/Active/:comp_user/:token', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    
    db_project.getActiveProjects(req.params.comp_user)
    .then(data => {
        res.send(data)})
    .catch(err => {res.status(500).send(err)})
})

//Gibt alle Projekte einer Firma aus, zu der der User account gehört und die derzeit aktiv sind
router.get('/Running/:comp_user/:token', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    
    db_project.getRunningProjects(req.params.comp_user)
    .then(data => res.send(data))
    .catch(err => {res.status(500).send(err)})
})

//Gibt alle Informationen zu einem speziellen Projekt aus
router.get('/:id', (req, res) => {
    db_project.getProjectInfo(req.params.id)
    .then(data => {
        res.send(data)})
    .catch(err=> console.log(err))

})

//Legt ein neues Projekt an
router.post('/:token', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    if(!(req.body.title && req.body.start_date && req.body.end_date && req.body.app_limit&& req.body.comp_id))  return res.status(400).send('Information missing')
    db_project.createProject(req.body.title, req.body.start_date, req.body.end_date, req.body.app_limit, req.body.comp_id)
    .then(data => {
        res.send(data.toString())})
    .catch(err=> console.log(err))
})

//Löscht ein bestehendes Projekt
router.delete('/:project_id/:token/:username', (req, res)=>{
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    username=req.params.username

    db_project.delteProject(req.params.project_id, username)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err))

})

module.exports = router;
