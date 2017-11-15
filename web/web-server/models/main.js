var mongoose = require('mongoose');
var config = require('../config/config.json');

mongoose.connect(config.mongoDbUri, {
    useMongoClient: true,
});


// load models
require('./user');
