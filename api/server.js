const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const { Pool, Client} = require('pg');

const API_PORT = 2001;
const app = express();
app.use(cors());
const router = express.Router();

const pool = new Pool({
    user: 'docker',
    host: 'localhost',
    database: 'docker',
    password: 'docker',
    port: 5432,
  })

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
    return res.json({"test": "t"})
});

router.get('/testDB', (req, res) => {
    pool.query('SELECT NOW()', (db_err, data) => {
        return res.json(data.rows)
        pool.end()
      })
})


// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));