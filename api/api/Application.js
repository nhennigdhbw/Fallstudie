const express = require('express');

const db_utils = require('../modules/db_utils');
const auth_utils = require('../modules/auth_utils');

router = express.Router();

router.post('/:role_id/:username/:token', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    
    username = req.params.username

    db_utils.assignApplication(username, req.params.role_id)
    .then(res.send('Application created'))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)})
    
})

router.put('/:role_id/:user_id/:username', (req, res)=>{
    db_utils.acceptApplication(req.params.role_id, req.params.user_id, req.params.username)
    .then(data => res.send('accepted'))
    .catch(err => res.status(500).send(err))
})

router.get('/:role_id', (req, res) => {
    //if (!req.cookies['Auth']) return res.status(401).send("Not signed in")
    //if(req.cookies['Auth']['type']=='f') return res.status(403).send("Not allowed")
    db_utils.getApplication(req.params.role_id)
    .then(data => res.send(data))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)})
})

router.get('/Freelancer/:username/:token', (req, res) => {
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')

    db_utils.getApplicationsFreelancer(req.params.username)
    .then(data => {
        res.send(data.rows)
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

router.get('/Company/:comp_id', (req, res) =>{
    db_utils.getApplicationsCompany(req.params.comp_id)
    .then(data => {
        console.log(data)
        res.send(data)
    })
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.delete('/:role_id/:username/:token',(req, res)=>{
    if(!auth_utils.validateToken(req.params.token)) return res.status(401).send('not signed in')
    db_utils.deleteApplication(req.params.role_id, req.params.username)
    .then(data => res.send(data))
    .catch(err=> {console.log(err)
        res.status(500).send(err)})

})

module.exports = router;