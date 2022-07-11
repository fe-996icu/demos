const mongoose = require('mongoose');
const { user, pwd, port, host, db: dbName, } = require('./config.js');
// import user from './config.js'

const CONNECT_STR = `mongodb://${ user }:${ pwd }@${ host }:${ port }/${ dbName }`;

console.log('连接字符串：', CONNECT_STR);

mongoose.connect(CONNECT_STR);

const db = mongoose.connection;

db.on('error', function(err){
	console.error(err);
});

db.once('open', function(res){
	console.log(res, '成功');

	var kittySchema = mongoose.Schema({
		name: String,
	});

	kittySchema.methods.speak = function(){
		var greeting = this.name ? 'Meow name is ' + this.name : 'I don\'t have a name';

		console.log(greeting);
	};

	var Kitten = mongoose.model('Kitten', kittySchema);

	var felyne = new Kitten({
		name: 'Felyne',
	});

	console.log(felyne.name);

	felyne.save(function(err, felyne){
		if(err){
			return console.error(err);
		}

		felyne.speak();
	});

	// db.close();
});