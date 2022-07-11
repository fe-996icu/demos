const mongoose = require('mongoose');

mongoose.connect('mongodb://admin:mongo@localhost:27017/mytest');

const db = mongoose.connection;

db.on('error', function(err){
	console.error(err);
});

db.once('open', function(err){
	if(err){
		return console.error(err);
	}

	console.log('connect success')

	const Animal = mongoose.model('222', new mongoose.Schema({name:String}, { collection: 'user' }));

	Animal.find({}, function(err, list){
		if(err){
			return console.error(err);
		}

		console.log(list);

		db.close();
	})

});

