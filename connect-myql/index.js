const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'mysql',
	database: 'mysql',
});

connection.connect();

connection.query('select * from user;', function(err, results, fields){
	if(err){
		throw err;
	}
debugger
	console.log(results[0].solution);
});

connection.end();