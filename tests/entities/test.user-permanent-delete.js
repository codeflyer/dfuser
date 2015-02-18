var Factory = require('entityx').Factory;

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: permanent delete', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    Factory.reset();
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(__dirname + '/../business/fixtures/users.js', done);
    });
  });

  it.skip('Permanent delete method', function(done) {
    var user = Factory.getEntity('User/User', 1);
    user.permanentDelete().then(
        function() {
          user.getId().should.be.equal(1);
          done();
        },
        function(err) {
          done();
        }
    );
  });
});
