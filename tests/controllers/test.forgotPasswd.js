var path = require('path');
var Factory = require('entityx').Factory;
var forgotPasswdCtrl = require('../../lib/controller/forgotPasswd');

var httpMocks = require('node-mocks-http');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('User POST /api/v1/user/forgot', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    Factory.reset();
    fixtures.clear(function(err) {
      fixtures.load(
          path.join(__dirname, '..', '/fixtures/users.js'), done);
    });
  });

  it('Wrong fields object', function(done) {
    var request = httpMocks.createRequest({
      method: 'POST',
      body: {
        fields: ''
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

    forgotPasswdCtrl(request, response);
  });

  it('Empty fields', function(done) {
    var request = httpMocks.createRequest({
      method: 'POST',
      body: {
        fields: {
          username: ''
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
          username: [
            'La lunghezza dello username deve essere ' +
            'compresa tra 5 e 255 caratteri.']
        },
        errorCount: 1
      };
      expected.should.eql(struct);
      done();
    };

    forgotPasswdCtrl(request, response);
  });

  it('Username not valid', function(done) {
    var request = httpMocks.createRequest({
      method: 'POST',
      body: {
        fields: {
          username: 'prova'
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
          username: ['Il campo username deve essere una email valida.']
        },
        errorCount: 1
      };
      expected.should.eql(struct);
      done();
    };

    forgotPasswdCtrl(request, response);
  });

  it.skip('Username does not exist', function(done) {
    var request = httpMocks.createRequest({
      method: 'POST',
      body: {
        fields: {
          username: 'username@notexist.com'
        }
      }
    });
    var response = httpMocks.createResponse();
    response.json = function(struct) {
      var expected = {
        code: '403',
        success: false,
        result: '403',
        message: 'Errore! Non esiste alcun account con questo indirizzo email!',
        value: {}
      };
      expected.should.eql(struct);
      done();
    };

    forgotPasswdCtrl(request, response);
  });
  it.skip('Request forgot password OK', function(done) {
    var request = httpMocks.createRequest({
      method: 'POST',
      body: {
        fields: {
          username: 'test@test.com'
        }
      }
    });
    var response = httpMocks.createResponse();
    response.json = function(struct) {
      var expected = {
        code: 0,
        success: true,
        'result': 0,
        'message': '',
        'value': {}
      };
      expected.should.eql(struct);
      done();
    };

    forgotPasswdCtrl(request, response);
  });
});
