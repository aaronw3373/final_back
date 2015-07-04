var config = require('./config.global.js');

config.env = 'production';
config.hostname = 'final-back.herokuapp.com';
config.serverPort = process.env.PORT;

config.mongo = {};
config.mongo.dbUrl = process.env.DBURL;

module.exports = config;
