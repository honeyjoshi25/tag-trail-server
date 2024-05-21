const mysql = require('mysql');

const dbconn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"node_redux"
});  

dbconn.connect(function(error){
    if(error) throw error;
    console.log("database connected successfully");
});

module.exports = dbconn;