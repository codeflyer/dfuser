require('should');
process.env.NODE_CONFIG_PERSIST_ON_CHANGE = 'N';
process.env.NODE_ENV = 'test';

process.on('uncaughtException', function(err) {
  console.log('UNCAUGHT EXCEPTION');
  console.log(err);
  console.log(err.stack);
  console.log('[Inside \'uncaughtException\' event]');
  process.exit(1);
});

var path = require('path');
var rootPath = path.join(__dirname, '../');
global.ROOT_PATH_FOR_TEST = rootPath;

global.DATABASE_NAME = 'UserModuleTest';
global.SESSION_COOKIE_NAME = 'connect.sid';

var config = require('./config');

var EntityX = require('entityx');
var userModule = require('../lib/index');
console.log('config');
console.log(config);
userModule.init(config);
console.log('User module initialized');

var ConnectionStore = require('connection-store');
var ready = require('readyness');

var fixtures = require('pow-mongodb-fixtures').connect(global.DATABASE_NAME);
ConnectionStore.addConnection('fixtures', fixtures);

var MongoClient = require('mongodb').MongoClient;
var mongoConnected = ready.waitFor('mongoDbOk');
console.log('TRY TO CONNECT');
MongoClient.connect(
    'mongodb://localhost/' + global.DATABASE_NAME, function(err, db) {
      if (err) {
        console.log('ERROR ON MONGO CONNECTION: ' + err);
        throw err;
      }
      console.log('Connected: ', 'mongodb://localhost/' + global.DATABASE_NAME)
      EntityX.ConnectionManager.addConnection(db);
      mongoConnected();
    });
