const { Pool} = require('pg');

let host = 'localhost'
if(process.env.DB_host) host=process.env.DB_host

const pool = new Pool({
    user: 'docker',
    host: host,
    database: 'docker',
    password: 'docker',
    port: 5432,
  })

module.exports={
    checkIfUserExists: function(username, isFreelancer){
        if (isFreelancer) table = 'freelancer'
        else table = 'company_account'
        return new Promise((resolve, reject) => {
          pool.query('SELECT user_id FROM freelancer WHERE username = $1', [username])
          .then(data => {
              if (data.rows[0].user_id>0){
                resolve()
              }else{
                reject(data)
              }
          })
          .catch(err => reject(err))
          
        })
      },

    createFreelancer: function(username, email, password, name, surname, gender){
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO freelancer (username, password, email, name, surname, gender) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id', 
        [username, password, email, name, surname, gender])
        .then(data => {
        resolve(data.rows[0].user_id);
        })
        .catch(err => {
        reject(err)
        reject(err)
        })
    })
    },

    createCompUser: function(username, email, password, name, surname, gender, comp_id){
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO company_account (username, password, email, name, surname, comp_id, gender) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id', 
        [username, password, email, name, surname, comp_id, gender])
        .then(data => {
        if (comp_id==0) reject();
        resolve(data.rows[0].user_id);
        })
        .catch(err => reject(err))
    })
    },

    deleteUser: function(username, type){
    if (type=='f') table = 'freelancer'
    else table = 'company_account'
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM ' + table +' WHERE username=$1', [username])
        .then(data => resolve(true))
        .catch(err => reject(err))
    })
    },

    updateFreelancer: function(username, new_password, new_email, infos){
    var i = 0;
    var upd_info = '';
    var params = [];
    for (key in infos){
        if(key!='username'){
        params[i] = infos[key]
        i = i+1;
        if(i>1) upd_info = upd_info + ','
        upd_info = upd_info + key + '=$' + i
        }
    }
    params[i] = infos['username']
    i = i+1;
    upd_info = upd_info + ' WHERE username=$' + i

    return new Promise((resolve, reject)=> {
        if (new_password) {
        pool.query('UPDATE freelancer SET password=$1 WHERE username=$2', [new_password, username])
        .then(resolve(true))
        .catch(err=>reject(err))
        }else if (new_email) {
        pool.query('UPDATE freelancer SET email=$1 WHERE username=$2', [new_email, username])
        .then(resolve(true))
        .catch(err => reject(err))
        }else{
        pool.query('UPDATE freelancer SET ' + upd_info , params)
        .then(resolve(true))
        .catch(err => reject(err))
        }
    })
    },

    updateCompUser: function(username, new_password, new_email, infos){
    var i = 0;
    var upd_info = '';
    var params = [];
    for (key in infos){
        if(key!='username'){
        params[i] = infos[key]
        i = i+1;
        if(i>1) upd_info = upd_info + ','
        upd_info = upd_info + key + '=$' + i
        }
    }
    params[i] = username
    i = i+1;
    upd_info = upd_info + ' WHERE username=$' + i

    console.log('UPDATE company SET ' + upd_info)
    console.log(params)

    return new Promise((resolve, reject)=> {
        pool.query('UPDATE company_account SET ' + upd_info , params)
        .then(data => {console.log(data)
            resolve(true)})
        .catch(err => {console.log(err)
            reject(err)})
    })
    },
    
    getUserInfo: function(username, isFreelancer) {
    if (isFreelancer) table = 'freelancer as t'
    else table = 'company_account as t'
    let compInfo = ''
    let select = ''
    if (!isFreelancer) {
        compInfo = ' LEFT JOIN company as c ON c.comp_id=t.comp_id '
        select = ', c.name AS company_name'
    }
    return new Promise((resolve, reject)=> {
        pool.query('SELECT t.*'+ select + ' FROM '+ table + compInfo+ ' WHERE t.username=$1', [username])
        .then(data => resolve(data.rows[0]))
        .catch(err => reject(err))
    })
    },

    findUser: function(username, email, type) {
        if (type=='f') table = 'freelancer'
        else table = 'company_account'
        if(!username && ! email) throw Error('no arguments provided')
        if (username)
            return new Promise((resolve, reject)=> {
            pool.query('SELECT * FROM ' + table + ' WHERE username=$1', [username])
            .then(data => resolve(data.rows[0]))
            .catch(err => reject(err))
            })
        else 
            return new Promise((resolve, reject)=> {
            pool.query('SELECT * FROM ' + table + ' WHERE email=$2', [email])
            .then(data => resolve(data.rows[0]))
            .catch(err => reject(err))
            })
        }
    
}