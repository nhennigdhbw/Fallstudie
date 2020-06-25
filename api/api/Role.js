const express = require('express');

const db_application = require('../modules/db_utils_application');
const db_role = require('../modules/db_utils_role')
const auth_utils = require('../modules/auth_utils');
const c = require('config');

router = express.Router();

router.get('/:username/:type/:token', (req, res) =>{
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    if(req.params.type!='f') return res.status(403).send("Not allowed")
    username = req.params.username
    db_role.getPersonalizedRoles(username)
    .then(data => res.send(data))
    .catch(err => {console.log(err)
        res.status(500).send(err)})
})

router.get('/:id/:token', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    db_role.getRole(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.get('/Freelancer/All/:id/:token', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    db_role.getRoleFull(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.get('/Timeline/:username/:token/:start_day', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    db_role.getRoleTimeline(req.params.username, req.params.start_day)
    .then(data => {
        res.send(data.rows)
    })
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.get('/Accepted/All/:role_id/:token', (req, res) =>{
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    db_application.getAccepted(req.params.role_id)
    .then(data => {
        res.send(data)
    })
    .catch(err => res.status(500).send(err))
})

router.post('/:token', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    db_role.createRole(req.body.title, req.body.description, req.body.reqs, req.body.area, req.body.payment)
    .then(data => {
        db_role.assignRoleToProject(req.body.project_id, data.role_id, req.body.numberOfFreeancers)
        .then(data => {
            res.send(data)
        })
        .catch(err => res.status(500).send(err))
    })
    .catch(err => {console.log(err)
        res.status(500).send(err)})
})

module.exports = router;