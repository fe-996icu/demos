const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');

const username = 'sa';
const password = 'sa';
const ip = 'localhost';
const port = 27017;

const url = `mongodb://${ username }:${ password }@${ ip }:${ port }`;

const dbName = 'mytest';

/**插入文档 */
const insertDocuments = function(db, callback){
	const collection = db.collection('user');

	collection.insertMany([
		{
			name: 'zhangsan',
			age: 11,
		},
		{
			name: 'lisi',
			age: 33,
		},
	], (err, result)=>{
		assert.equal(err, null);
		assert.equal(2, result.result.n);
		assert.equal(2, result.ops.length);

		console.log('Inserted 2 documents into the collection');

		callback(result);
	});
};

function find(db, callback){
	const collection = db.collection('user');

	collection.find({}).toArray((err, docs)=>{
		// console.log(err, result, 'call....');

		console.log(docs);

		// db.close();
		callback();
	});
}

MongoClient.connect(url, (err, client)=>{
	assert.equal(null, err);
	console.log('Connected successfully to server');

	const db = client.db(dbName);

	// console.log(db);

	// insertDocuments(db, (...args)=>{
	// 	console.log(args);

	// 	client.close();
	// });

	find(db, ()=>{
		client.close();
	});

	// client.close();
});
