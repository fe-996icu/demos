const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
	id: mongoose.SchemaTypes.ObjectId,
	name: String,
	age: Number,
	gender: Boolean,
	addr: String,
});

console.log(User);

// mongoose.connect('mongodb://localhost:27017/mytest', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(v=>{
// 	console.log(v);


// });