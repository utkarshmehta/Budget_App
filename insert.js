var mysql = require('mysql');
var connection = mysql.createConnection({

host:'localhost',
user: 'root',
password: 'password',
database: budget,
});

connection.connect();