var Client = require('node-rest-client').Client;
var async = require('async');
var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('REST: forgot', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    fixtures.clear(function(err) {
      fixtures.load(__dirname + '/../business/fixtures/users.js', done);
    });
  });

  it('Forgot params not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {},
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/forgot',
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

  it('Forgot param username not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {}
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/forgot',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.username[0].should.be.equal(
                      'La lunghezza dello username deve essere compresa tra ' +
                      '5 e 255 caratteri.');
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

  it('Forgot username not exists in the system', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@mail.com'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/forgot',
                args, function(data, response) {
                  data.result.should.be.equal(403);
                  data.message.should.be.equal(
                      'Errore! Non esiste alcun account con questo ' +
                      'indirizzo email!');
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

  it('Forgot ok', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'test@test.com'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/forgot',
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
