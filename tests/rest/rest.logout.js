var Client = require('node-rest-client').Client;
var async = require('async');
var utils = require(global.ROOT_PATH_FOR_TEST + 'tests/utils');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('REST: logout', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    fixtures.clear(function(err) {
      fixtures.load(__dirname + '/../business/fixtures/users.js', done);
    });
  });

  it('Logout non logged', function(done) {
    var client = new Client();
    async.waterfall(
        [
          function(next) {
            var args = {
              data: {},
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/logout',
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

  it('Logout ok', function(done) {
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
            client.post('http://127.0.0.1:3010/api/v1/user/logout',
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
