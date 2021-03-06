const express = require('express');

const db_utils = require('../modules/db_utils')

const router = express.Router();

//Gibt alle verfügbaren Arbeitsfelder aus, strukturiert als Array von JSON
router.get('/', (req, res) => {
    db_utils.getAllPrefences()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err))
})

//Gibt die zugewiesenen Arbeitsfelder des Nutzers aus, strukturiert als Array von JSON
router.get('/:username', (req, res) => {
    if (!req.params.username) return res.status(400).send('No username provided')
    else{
        db_utils.getPrefences(req.body.username)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
    }
})

//Weist einem Nutzer ein neues Arbeitsfeld zu, die gewünschte Präfenz muss im Body vorhanden sein
router.put('/:username', (req, res) => {
    if(!req.params.username) return res.status(400).send('No username Provided')
    if(!req.body.prefence) return res.status(400).send('No prefence provided')

    db_utils.assignPrefence(req.params.username, req.body.prefence)
    .then(data => res.send('successful'))
    .catch(err => res.status(500).send(err))
})

//Löscht eine Präfenzzuweisung
router.delete('/:username/:prefence', (req, res) => {
    if(!req.params.username) return res.status(400).send('No username Provided')
    if(!req.params.prefence) return res.status(400).send('No prefence provided')
    
    db_utils.deletePrefenceAssignment(req.params.username, req.params.prefence)
    .then(data => res.send('successful'))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})


module.exports = router;