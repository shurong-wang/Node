var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function () {
    var db = mongoose.connect(config.mongodb);

    require('../models/user.server.model.js');
    return db;
};