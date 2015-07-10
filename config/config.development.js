var config = require('./config.global.js');

config.env = 'development';
config.hostname = 'localhost';
config.serverPort = 3000;

config.mongo = {};
config.mongo.dbUrl = process.env.DBURL;

module.exports = config;
