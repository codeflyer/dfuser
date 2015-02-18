var Client = require('node-rest-client').Client;
var async = require('async');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('REST: resetPasswd', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(__dirname + '/../business/fixtures/users.js', done);
    });
  });

  it('ResetPasswd params not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {},
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/resetpasswd',
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

  it('ResetPasswd param password not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  confirmPassword: 'abcdefghi',
                  token: '1891bf24124433506cf6538c6c119c1375a24b4dc32e9' +
                  '769800f88560d1ed1a6561dcf829c277b78b530e27f9b6b90e76' +
                  '24c1d89075489d29ad86a787ebe2353'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/resetpasswd',
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

  it('ResetPasswd param confirmPassword not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  password: 'abcdefghi',
                  token: '1891bf24124433506cf6538c6c119c1375a24b4dc32e976' +
                  '9800f88560d1ed1a6561dcf829c277b78b530e27f9b6b90e7624c1' +
                  'd89075489d29ad86a787ebe2353'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/resetpasswd',
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

  it('ResetPasswd param token not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  password: 'abcdefghi',
                  confirmPassword: 'abcdefghi'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/resetpasswd',
                args, function(data, response) {
                  data.result.should.be.equal(403);
                  data.message.should.be.equal(
                      'Errore! Reset token non valido o scaduto!!');
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

  it('ResetPasswd param token not valid', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  password: 'abcdefghi',
                  confirmPassword: 'abcdefghi',
                  token: 'dsfdsfdfdsfdsfdsfdsfdsfds'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/resetpasswd',
                args, function(data, response) {
                  data.result.should.be.equal(403);
                  data.message.should.be.equal(
                      'Errore! Reset token non valido o scaduto!!');
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

  it('ResetPasswd param token expired', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  password: 'abcdefghi',
                  confirmPassword: 'abcdefghi',
                  token: 'd2c18e6d8998e5271bdb6e1bb79941685ed1bcfd4be1d' +
                  '44bdda68240b21cbf4803f76cfa08f565ac73be6ac2ffc482fc4' +
                  'c0f1ad449afedf0b6126f68c7c63d36'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/resetpasswd',
                args, function(data, response) {
                  data.result.should.be.equal(403);
                  data.message.should.be.equal(
                      'Errore! Reset token non valido o scaduto!!');
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

  it('ResetPasswd ok', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  password: 'abcdefghi',
                  confirmPassword: 'abcdefghi',
                  token: '1891bf24124433506cf6538c6c119c1375a24b4dc32e97698' +
                  '00f88560d1ed1a6561dcf829c277b78b530e27f9b6b90e7624c1d890' +
                  '75489d29ad86a787ebe2353'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/resetpasswd',
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
