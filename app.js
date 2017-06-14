const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/main');
const Book = require('./models/book');

const port = config.port
const db = config.database

mongoose.connect(db);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req, res){
	res.send('Affirmative!');
});

app.get('/books', function(req, res){
	console.log('Fetching All Books from Database');
	Book.find({})
	.exec(function(err, books){
		if(err){
			res.send('An Error has occured');
		} else {
			console.log(books);
			res.json(books);
		}
	});
});

app.get('/books/:id', function(req, res){
	console.log('Fetch one Book');
	Book.findOne({
		_id: req.params.id
	})
	.exec(function(err, book){
		if(err) {
			res.send('Error Occured')
		} else {
			console.log(book)
			res.json(book);
		}
	});
})

app.post('/books', function(req, res){
	let newBook = new Book();

	newBook.title = req.body.title
	newBook.author = req.body.author
	newBook.category = req.body.category

	newBook.save(function(err, book){
		if(err){
			res.send('error saving book');
		} else {
			console.log(book);
			res.send(book);
		}
	});
});

app.put('/books/:id', function(req, res){
	Book.findOneAndUpdate({
		_id: req.params.id
	},
	{$set: {title: req.body.title}},
	{upsert: true},
	function(err, newBook){
		if(err){
			console.log('error occured');
		} else {
			console.log(newBook);
			res.status(204);
		}
	});
});

app.listen(port, function(){
	console.log('App is now listening on port ' + port);
})
