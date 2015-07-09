var config = require('./config.global.js');

config.env = 'development';
config.hostname = 'localhost';
config.serverPort = 3000;

config.mongo = {};
config.mongo.dbUrl = 'mongodb://localhost/powplanner';
// config.mongo.dbUrl = 'mongodb://localhost/dbclakre';
// config.mongo.dbUrl = 'mongodb://aaronw3373:password1@ds045882.mongolab.com:45882/clarkedb';

module.exports = config;
