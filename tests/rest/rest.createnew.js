var Client = require('node-rest-client').Client;
var async = require('async');
var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe.skip('REST: createNew', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    fixtures.clear(function(err) {
      fixtures.load(__dirname + '/../business/fixtures/users.js', done);
    });
  });

  it('createNew params not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {},
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
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

  it('createNew param username not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  password: 'password',
                  confirmPassword: 'password',
                  name: 'Qwerty',
                  surname: 'azerty',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.email[0].should.be.equal(
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

  it('createNew param password not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@quer.com',
                  confirmPassword: 'password',
                  name: 'Qwerty',
                  surname: 'azerty',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.password[0].should.be.equal(
                      'La lunghezza della password deve essere compresa tra ' +
                      '6 e 16 caratteri.');
                  data.errors.confirmPassword[0].should.be.equal(
                      'La password non coincide.');
                  data.errorCount.should.be.equal(2);
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

  it('createNew param confirmPassword not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@quer.com',
                  password: 'password',
                  name: 'Qwerty',
                  surname: 'azerty',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.confirmPassword[0].should.be.equal(
                      'La password non coincide.');
                  data.errorCount.should.be.equal(1);
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

  it('createNew param name not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@quer.com',
                  password: 'password',
                  confirmPassword: 'password',
                  surname: 'azerty',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.name[0].should.be.equal(
                      'La lunghezza del nome deve essere compresa tra ' +
                      '2 e 50 caratteri.');
                  data.errorCount.should.be.equal(1);
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

  it('createNew param surname not exists', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@quer.com',
                  password: 'password',
                  confirmPassword: 'password',
                  name: 'Qwerty',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.surname[0].should.be.equal(
                      'La lunghezza del cognome deve essere compresa tra ' +
                      '2 e 50 caratteri.');
                  data.errorCount.should.be.equal(1);
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

  it('createNew param username not valid', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty',
                  password: 'password',
                  confirmPassword: 'password',
                  name: 'Qwerty',
                  surname: 'Qsdsddswerty',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.email[0].should.be.equal('Email non valida.');
                  data.errorCount.should.be.equal(1);
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

  it('createNew param password not valid', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@erer.it',
                  password: 'pa',
                  confirmPassword: 'pa',
                  name: 'Qwerty',
                  surname: 'Qsdsddswerty',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.password[0].should.be.equal(
                      'La lunghezza della password deve essere compresa tra ' +
                      '6 e 16 caratteri.');
                  data.errorCount.should.be.equal(1);
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

  it('createNew param confirmPassword not valid', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@erer.it',
                  password: 'password',
                  confirmPassword: 'pa',
                  name: 'Qwerty',
                  surname: 'Qsdsddswerty',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.confirmPassword[0].should.be.equal(
                      'La password non coincide.');
                  data.errorCount.should.be.equal(1);
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

  it('createNew param name not valid', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@erer.it',
                  password: 'password',
                  confirmPassword: 'password',
                  name: 'Q',
                  surname: 'Qsdsddswerty',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.name[0].should.be.equal(
                      'La lunghezza del nome deve essere compresa tra ' +
                      '2 e 50 caratteri.');
                  data.errorCount.should.be.equal(1);
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

  it('createNew param surname not valid', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@erer.it',
                  password: 'password',
                  confirmPassword: 'password',
                  name: 'Qkjkj',
                  surname: 'Q',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(1);
                  data.errors.surname[0].should.be.equal(
                      'La lunghezza del cognome deve essere compresa tra ' +
                      '2 e 50 caratteri.');
                  data.errorCount.should.be.equal(1);
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

  it('createNew OK', function(done) {
    var client = new Client();

    async.waterfall(
        [
          function(next) {
            var args = {
              data: {
                fields: {
                  username: 'qwerty@erer.it',
                  password: 'password',
                  confirmPassword: 'password',
                  name: 'Qkjkj',
                  surname: 'Qkjkj',
                  locale: 'it_IT'
                }
              },
              headers: {'Content-Type': 'application/json'}
            };
            client.post('http://127.0.0.1:3010/api/v1/user/createnew',
                args, function(data, response) {
                  data.result.should.be.equal(0);
                  data.value.username.should.be.equal('qwerty@erer.it');
                  data.value.email.should.be.equal('qwerty@erer.it');
                  data.value.name.should.be.equal('Qkjkj');
                  data.value.surname.should.be.equal('Qkjkj');
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
