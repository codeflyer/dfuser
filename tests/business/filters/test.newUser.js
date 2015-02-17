var NewUserFilter = require('../../../lib/business/filters/NewUser');
describe('user: Filters/NewUser', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  it('Check sanitize all string', function() {
    var parametersCheck = {
      'username': 'userN',
      'password': 'pwd',
      'confirmPassword': 'pwd',
      'email': 'email@em.it',
      'name': 'paolo',
      'surname': 'rossi'
    };
    var parameters = {
      'username': 'userN',
      'password': 'pwd',
      'confirmPassword': 'pwd',
      'email': 'email@em.it',
      'name': 'paolo',
      'surname': 'rossi'
    };
    parameters = NewUserFilter.sanitize(parameters);
    parameters.should.have.property('username');
    parameters.username.should.be.equal(parametersCheck.username.toLowerCase());
    parameters.password.should.be.equal(parametersCheck.password);
    parameters.confirmPassword.should.be.equal(parametersCheck.confirmPassword);
    parameters.email.should.be.equal(parametersCheck.email.toLowerCase());
    parameters.name.should.be.equal(parametersCheck.name);
    parameters.surname.should.be.equal(parametersCheck.surname);
    Object.keys(parameters).length.should.be.equal(6);
  });

  it('Check sanitize not string', function() {
    var parametersCheck = {
      'username': '1',
      'password': '2',
      'confirmPassword': '3',
      'name': '5',
      'surname': '6'
    };
    var parameters = {
      'username': 1,
      'password': 2,
      'confirmPassword': 3,
      'name': 5,
      'surname': 6
    };
    parameters = NewUserFilter.sanitize(parameters);
    parameters.should.have.property('username');
    parameters.username.should.be.equal(parametersCheck.username.toLowerCase());
    parameters.password.should.be.equal(parametersCheck.password);
//        parameters.confirmPassword.should.be.equal(parametersCheck.confirmPassword);
//        parameters.name.should.be.equal(parametersCheck.name);
//        parameters.surname.should.be.equal(parametersCheck.surname);
    Object.keys(parameters).length.should.be.equal(5);
  });
});
