var path = require('path');
var Factory = require('entityx').Factory;
var createnewCtrl = require('../../lib/controller/createnew');

var httpMocks = require('node-mocks-http');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('POST /api/v1/user/createnew', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    Factory.reset();
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(
          path.join(__dirname, '..', '/fixtures/users-empty.js'), done);
    });
  });

  it('Empty params', function(done) {
    var request = httpMocks.createRequest({
      method: 'POST',
      params: {
        id: 42
      }
    });
    var response = httpMocks.createResponse();
    response.json = function(struct) {
      var expected = {
        code: 1001,
        success: false, result: 1001, message: 'Inconsistent data', value: {}
      };
      expected.should.eql(struct);
      done();
    };

    createnewCtrl(request, response);
  });

  it('Wrong params', function(done) {
    var request = httpMocks.createRequest({
      method: 'POST',
      body: {
        fields: {
          username: '',
          name: '',
          surname: '',
          password: '',
          confirmPassword: ''
        }
      }
    });
    var response = httpMocks.createResponse();
    response.json = function(struct) {
      var expected = {
        code: 1,
        success: false,
        result: 1,
        message: '',
        value: {},
        errors: {
          username: ['La lunghezza dello username deve essere compresa tra ' +
          '5 e 255 caratteri.'],
//                    name : [ 'La lunghezza del nome deve essere compresa tra 2 e 50 caratteri.' ],
//                    surname : [ 'La lunghezza del cognome deve essere compresa tra 2 e 50 caratteri.' ],
          password: ['La lunghezza della password deve essere compresa tra ' +
          '6 e 16 caratteri.']
        },
        errorCount: 2 //4
      };
      expected.should.eql(struct);
      done();
    };

    createnewCtrl(request, response);
  });

  it('Create OK', function(done) {
    var request = httpMocks.createRequest({
      method: 'POST',
      body: {
        fields: {
          username: 'davide@codeflyer.com',
          name: 'Davide',
          surname: 'Fiorello',
          password: 'pass1234',
          confirmPassword: 'pass1234'
        }
      }
    });
    var response = httpMocks.createResponse();
    response.json = function(struct) {
      var expected = {
        code: 0,
        success: true,
        result: 0,
        message: '',
        value: {
          username: 'davide@codeflyer.com',
          email: 'davide@codeflyer.com',
          name: '',
          surname: ''
        }
      };
      expected.should.eql(struct);
      setTimeout(function() {
        done();
      }, 1500);
    };

    var mailer = require('../testMailer');
    mailer.setSendMailCallback(function(values) {
      console.log(values);
    });
    require('../../lib/di').setMailer(mailer);

    createnewCtrl(request, response);
  });
});
