// 引入mysql模块
const mysql = require('mysql');

// 创建连接对象
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'mysql',
	database: 'mytest',
});

// 打开链接
connection.connect();

// 准备要插入的sql命令
const sql = `insert into user (username, password, nickname, gender, age, hobby) values ('laoliu', 'laoliu', '老刘', 0, 20, '唱歌跳舞打豆豆');`;

// 执行sql
connection.query(sql, function(err, results, fields){
	if(err)
		throw err;
	
	debugger;
	console.log(err, results, fields);
});


// 执行查询
connection.query('select * from user;', function(err, results, fields){
	if(err){
		throw err;
	}
// debugger
	console.log(JSON.stringify(results, null, '\t'));
});

connection.end();