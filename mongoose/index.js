// 导入依赖库
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://admin:mongo@localhost:27017/mytest');

const db = mongoose.connection;

db.on('error', (err)=>{
	console.error(err,444);
});

db.once('open', ()=>{
	// console.timeEnd('time');
	console.log('we\'re connected!');

	console.time('time');

	// const users = db.collections('user').find({})
	// console.log(users,44)

	const kittySchema = mongoose.Schema({
		name: String,
	});

	// const Kitten = mongoose.model('Kitten', kittySchema);

	// var felyne = new Kitten({
	// 	name: 'Felyne'
	// });

	// console.log(felyne.name);

	kittySchema.methods.speak = function(){
		var greeting = this.name ? 'Meow name is ' + this.name : 'I don\'t have a name';

		console.log(greeting);
	};

	const Kitten = mongoose.model('Kitten2saaa', kittySchema);

	// var fluffy = new Kitten({
	// 	name: 'fluffy',
	// });

	// fluffy.speak();

	// fluffy.save(function(err, fluffy){
	// 	if(err){
	// 		return console.error(err);
	// 	}

	// 	fluffy.speak();
	// });

	Kitten.find({}, function(err, kittens){
		if(err){
			return console.error(err);
		}

		console.timeEnd('time');
		console.log(kittens);
	});
});

