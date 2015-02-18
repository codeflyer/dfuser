var Client = require('node-rest-client').Client;
var async = require('async');
var utils = require(global.ROOT_PATH_FOR_TEST + 'tests/utils');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('REST: login', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(__dirname + '/../business/fixtures/users.js', done);
    });
  });

  it('Login user not exists', function(done) {
    var client = new Client();
    var loginCookie;
    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                'username': 'test3@test.com',
                'password': 'password'
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/login',
                args, function(data, response) {
                  loginCookie = utils.getLoginCookie(response.headers);
                  data.result.should.be.equal(401);
                  data.message.should.be.equal('Incorrect username.');
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

  it('Password not correct', function(done) {
    var client = new Client();
    var loginCookie;
    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                'username': 'test@test.com',
                'password': 'password2'
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/login',
                args, function(data, response) {
                  loginCookie = utils.getLoginCookie(response.headers);
                  data.result.should.be.equal(401);
                  data.message.should.be.equal('Incorrect password.');
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
