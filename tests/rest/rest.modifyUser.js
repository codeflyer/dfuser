var Client = require('node-rest-client').Client;
var async = require('async');
var utils = require(global.ROOT_PATH_FOR_TEST + 'tests/utils');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('REST: modifyUser', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(__dirname + '/../business/fixtures/users.js', done);
    });
  });

  it('ModifyUser not logged', function(done) {
    var client = new Client();
    async.waterfall(
        [
          function(next) {
            var args = {
              data: {},
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/modifyuser',
                args, function(data, response) {
                  data.result.should.be.equal(404);
                  data.message.should.be.equal('User not logged');
                  next(null);
                }
            );
          }
        ],
        function(err) {
          done();
        }
    );
  });

  it('ModifyUser params not exists', function(done) {
    var client = new Client();
    var loginCookie;

    async.waterfall(
        [
          function(next) {
            utils.login('test@test.com', 'password', function(err, result) {
              loginCookie = result;
              next();
            });
          },
          function(next) {
            var args = {
              data: {},
              headers: {
                'Content-Type': 'application/json',
                Cookie: 'connect.sid=' + loginCookie
              }
            };
            client.post('http://127.0.0.1:3010/api/v1/user/modifyuser',
                args, function(data, response) {
                  data.result.should.be.equal(1001);
                  data.message.should.be.equal('Inconsistent data');
                  next(null);
                }
            );
          }
        ],
        function(err) {
          done();
        }
    );
  });

  it('ModifyUser param name not exists', function(done) {
    var client = new Client();
    var loginCookie;

    async.waterfall(
        [
          function(next) {
            utils.login('test@test.com', 'password', function(err, result) {
              loginCookie = result;
              next();
            });
          },
          function(next) {
            var args = {
              data: {
                fields: {
                  surname: 'testtesttest'
                }
              },
              headers: {
                'Content-Type': 'application/json',
                Cookie: 'connect.sid=' + loginCookie
              }
            };
            client.post('http://127.0.0.1:3010/api/v1/user/modifyuser',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.name[0].should.be.equal(
                      'La lunghezza del nome deve essere compresa tra ' +
                      '2 e 50 caratteri.');
                  next(null);
                }
            );
          }
        ],
        function(err) {
          done();
        }
    );
  });

  it('ModifyUser param surname not exists', function(done) {
    var client = new Client();
    var loginCookie;

    async.waterfall(
        [
          function(next) {
            utils.login('test@test.com', 'password', function(err, result) {
              loginCookie = result;
              next();
            });
          },
          function(next) {
            var args = {
              data: {
                fields: {
                  name: 'qwerty'
                }
              },
              headers: {
                'Content-Type': 'application/json',
                Cookie: 'connect.sid=' + loginCookie
              }
            };
            client.post('http://127.0.0.1:3010/api/v1/user/modifyuser',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.surname[0].should.be.equal(
                      'La lunghezza del cognome deve essere compresa ' +
                      'tra 2 e 50 caratteri.');
                  next(null);
                }
            );
          }
        ],
        function(err) {
          done();
        }
    );
  });

  it('ModifyUser ok', function(done) {
    var client = new Client();
    var loginCookie;

    async.waterfall(
        [
          function(next) {
            utils.login('test@test.com', 'password', function(err, result) {
              loginCookie = result;
              next();
            });
          },
          function(next) {
            var args = {
              data: {
                fields: {
                  name: 'qwerty',
                  surname: 'testtesttest'
                }
              },
              headers: {
                'Content-Type': 'application/json',
                Cookie: 'connect.sid=' + loginCookie
              }
            };
            client.post('http://127.0.0.1:3010/api/v1/user/modifyuser',
                args, function(data, response) {
                  data.result.should.be.equal(0);
                  data.value.username.should.be.equal('test@test.com');
                  data.value.email.should.be.equal('test@test.com');
                  data.value.name.should.be.equal('qwerty');
                  data.value.surname.should.be.equal('testtesttest');
                  next(null);
                }
            );
          }
        ],
        function(err) {
          done();
        }
    );
  });
});
