var ForgotPasswordFilter =
    require('../../../lib/business/filters/ForgotPasswd');
describe('user: Filters/ForgotPassword', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  it('Check sanitize', function(done) {
    var parameters = {'username': 1};
    ForgotPasswordFilter.sanitize(parameters, function() {
      parameters.should.have.property('username');
      parameters.username.should.be.equal('1');
      parameters.username.should.not.be.equal(1);
      done();
    });
  });
});
