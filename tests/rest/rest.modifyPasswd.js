var Client = require('node-rest-client').Client;
var async = require('async');
var utils = require(global.ROOT_PATH_FOR_TEST + 'tests/utils');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('REST: modifyPasswd', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    fixtures.clear(function(err) {
      fixtures.load(__dirname + '/../business/fixtures/users.js', done);
    });
  });

  it('modifyPasswd not logged', function(done) {
    var client = new Client();
    async.waterfall(
        [
          function(next) {
            var args = {
              data: {},
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/modifypasswd',
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

  it('modifyPasswd params not exists', function(done) {
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
            client.post('http://127.0.0.1:3010/api/v1/user/modifypasswd',
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

  it('modifyPasswd param password not exists', function(done) {
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
                  confirmPassword: 'abcdefg'
                }
              },
              headers: {
                'Content-Type': 'application/json',
                Cookie: 'connect.sid=' + loginCookie
              }
            };
            client.post('http://127.0.0.1:3010/api/v1/user/modifypasswd',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.password[0].should.be.equal(
                      'La lunghezza della password deve essere compresa tra ' +
                      '6 e 16 caratteri.');
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

  it('modifyPasswd param confirmPassword not exists', function(done) {
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
                  password: 'abcdefg'
                }
              },
              headers: {
                'Content-Type': 'application/json',
                Cookie: 'connect.sid=' + loginCookie
              }
            };
            client.post('http://127.0.0.1:3010/api/v1/user/modifypasswd',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.password[0].should.be.equal(
                      'La password non coincide.');
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

  it('modifyPasswd ok', function(done) {
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
                  password: 'abcdefg',
                  confirmPassword: 'abcdefg'
                }
              },
              headers: {
                'Content-Type': 'application/json',
                Cookie: 'connect.sid=' + loginCookie
              }
            };
            client.post('http://127.0.0.1:3010/api/v1/user/modifypasswd',
                args, function(data, response) {
                  data.result.should.be.equal(0);
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
