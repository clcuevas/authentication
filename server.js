'use strict';

var mongoose = require('mongoose');
var express = require('express');
var app = express();
var passport = require('passport');

process.env.APP_SECRET = process.env.APP_SECRET || 'changethischangethis';

var petRouter = express.Router();
var userRouter = express.Router();

//this is how you connect to the mongoDB
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/pet_dev');

app.use(passport.initialize());

require('./lib/passport_strat.js')(passport);

require('./routes/pet_routes.js')(petRouter);
require('./routes/auth_routes.js')(userRouter, passport);

app.use('/api', petRouter);
app.use('/api', userRouter);

app.listen(process.env.PORT || 3000, function() {
	console.log('server running on port ' + (process.env.PORT || 3000));
});
