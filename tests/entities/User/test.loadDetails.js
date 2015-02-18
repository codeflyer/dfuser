var crypto = require('crypto');
var path = require('path');
var Factory = require('entityx').Factory;
var UserManager = require('../../../lib/business/UserManager');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: User loadDetails', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    Factory.reset();
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(
          path.join(__dirname, '../..', '/fixtures/users.js'), done);
    });
  });

  it('Load details with full details', function(done) {
    UserManager.loadByUsername('load1@test.com').then(function(user) {
      user.getId().should.be.equal(4);
      user.load().then(
          function() {
            user.getUsername().should.be.equal('load1@test.com');
            user.getPassword().should.be.equal(
                crypto.createHash('md5').update('password').digest('hex'));
            user.getEmail().should.be.equal('load1@test.com');
            user.getName().should.be.equal('Paolo');
            user.getSurname().should.be.equal('Rossi');
            user.getLocale().should.be.equal('it_IT');

            user.getResetPasswordToken()._data.should.be.eql({
              'token': 'd5c18e6d8998e5271bdb6e1bb79941685ed1',
              'expire': 150000
            });

            user.getAutoLoginToken()._data.should.be.eql({
              'token': 'abcde6d8998e5271bdb6e1bb79941685ed1b',
              'expire': 300000
            });

            user.getConfirmationToken()._data.should.be.eql({
              'token': 'd3c18e6d8998e5271bdb6e1bb79941685ed1',
              'expire': 150000
            });

            user.getLastLogin().should.be.eql(
                new Date('2014-05-08T09:29:02.613Z'));

            user.getIsActive().should.be.true;
            user.getIsDisabled().should.be.true;
            user.getIsAdmin().should.be.true;

            user.getRoles().should.be.eql(['admin', 'guest', 'USER-ROLE-4']);

            done();
          }
      );
    }).catch(function(err) {
      done(err);
    });
  });

  it('Load details with undefined fields', function(done) {
    UserManager.loadByUsername('load2@test.com').then(function(user) {
      user.getId().should.be.equal(5);
      user.load().then(
          function() {
            user.getUsername().should.be.equal('load2@test.com');
            user.getPassword().should.be.equal(
                crypto.createHash('md5').update('password').digest('hex'));
            user.getEmail().should.be.equal('load2@test.com');
            user.getName().should.be.equal('Paolo');
            user.getSurname().should.be.equal('Rossi');
            user.getLocale().should.be.equal('it_IT');

            user.getResetPasswordToken()._data.should.be.eql({
              'token': '',
              'expire': null
            });

            user.getAutoLoginToken()._data.should.be.eql({
              'token': '',
              'expire': null
            });

            user.getConfirmationToken()._data.should.be.eql({
              'token': '',
              'expire': null
            });

            user.getLastLogin().should.be.eql(
                new Date('2014-05-08T09:29:02.613Z'));

            user.getIsActive().should.be.false;
            user.getIsDisabled().should.be.false;
            user.getIsAdmin().should.be.false;

            user.getPredefinedRoles().should.be.eql([]);
            user.getRoles().should.be.eql(['USER-ROLE-5']);

            done();
          }
      );
    }).catch(function(err) {
      done(err);
    });
  });
});
