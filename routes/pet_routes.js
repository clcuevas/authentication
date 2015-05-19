'use strict';

var Pet = require('../models/Pet.js');
var bodyparser = require('body-parser');
var eatAuth = require('../lib/eat_auth.js')(process.env.APP_SECRET);

module.exports = function(router) {
	router.use(bodyparser.json());

	router.get('/pets', function(req, res) {
		Pet.find({}, function(err, data) {
			if(err) {
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}

			res.json(data);
		});
	});

	router.post('/pets', eatAuth, function(req, res) {
		var newPet = new Pet(req.body);

		newPet.save(function(err, data) {
			if(err) {
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}

			res.json(data);
		});
	});

	router.put('/pets/:id', eatAuth, function(req, res) {
		var updatedPet = req.body;
		delete updatedPet._id;

		Pet.update({'_id': req.params.id}, updatedPet, function(err, data) {
			if(err) {
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}

			res.json({msg: 'success'});
		});
	});

	router.delete('/pets/:id', eatAuth, function(req, res) {
		Pet.remove({'_id': req.params.id}, function(err, data) {
			if(err) {
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}

			res.json({msg: 'deleted successfully'});
		});
	});

};