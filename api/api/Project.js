const express = require('express');

const db_utils = require('../modules/db_utils');
const auth_utils = require('../modules/auth_utils')

router = express.Router();

router.get('/:comp_user/:token', (req, res) => {
    console.log(req)
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    
    db_utils.getAllProjects(req.params.comp_user)
    .then(data => res.send(data))
    .catch(err => {res.status(500).send(err)})
})

router.get('/:id', (req, res) => {
    db_utils.getProjectInfo(req.params.id)
    .then(data => res.send(data))
    .catch(err=> console.log(err))

})

router.delete('/:project_id', (req, res)=>{
    if (!req.cookies['Auth']) return res.status(401).send("Not signed in")
    if(req.cookies['Auth']['type']=='f') return res.status(403).send("Not allowed")
    username=req.cookies['Auth']['username']

    db_utils.delteProject(req.params.project_id, username)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err))

})

module.exports = router;
