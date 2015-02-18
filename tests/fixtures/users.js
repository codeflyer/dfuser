var crypto = require('crypto');

/*jshint camelcase: false */
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
exports.dfcore_users = [
  {
    '_id': 1, 'username': 'test@test.com',
    'password': crypto.createHash('md5').update('password').digest('hex'),
    'email': 'test@test.com',
    'name': 'Davide',
    'surname': 'Fiorello',
    'locale': 'it_IT',
    'lastLogin': null,
    'isAdmin': false,
    'isActive': false,
    'isDisabled': false,
    '_ts': {
      'created': new Date('2014-05-05T09:29:02.613Z'),
      'modified': new Date('2014-05-05T09:29:02.613Z'),
      'deleted': null
    },
    'confirmationToken': {'token': '', 'expire': ''},
    'resetPasswordToken': {
      'token': '1891bf24124433506cf6538c6c119c1375a24b4dc32e9769800f88560' +
      'd1ed1a6561dcf829c277b78b530e27f9b6b90e7624c1d89075489d29ad86a787eb' +
      'e2353',
      'expire': Date.now() + 1000000
    },
    'autoLoginToken': {'token': '', 'expire': ''}
  },
  {
    '_id': 2, 'username': 'test2@test.com',
    'password': crypto.createHash('md5').update('password').digest('hex'),
    'email': 'test2@test.com',
    'name': 'Paolo',
    'surname': 'Rossi',
    'locale': 'it_IT',
    'lastLogin': null,
    'isAdmin': false,
    'isActive': false,
    'isDisabled': false,
    '_ts': {
      'created': new Date('2014-05-05T09:29:02.613Z'),
      'modified': new Date('2014-05-05T09:29:02.613Z'),
      'deleted': null
    },
    'confirmationToken': {'token': '', 'expire': ''},
    'autoLoginToken': {
      'token': 'abcde6d8998e5271bdb6e1bb79941685ed1bcfd4be1d44bdda68240b',
      'expire': Date.now() + 2000
    }
  },
  {
    '_id': 3,
    'username': 'test3@test.com',
    'password': crypto.createHash('md5').update('password').digest('hex'),
    'email': 'test3@test.com',
    'name': 'Paolo',
    'surname': 'Rossi',
    'locale': 'it_IT',
    'lastLogin': null,
    'isAdmin': false,
    'isActive': false,
    'isDisabled': false,
    '_ts': {
      'created': new Date('2014-05-05T09:29:02.613Z'),
      'modified': new Date('2014-05-05T09:29:02.613Z'),
      'deleted': null
    },
    'confirmationToken': {
      'token': 'd3c18e6d8998e5271bdb6e1bb79941685ed1bcfd4be1d44bdda68240b',
      'expire': Date.now() - 10000000000
    },
    'autoLoginToken': {'token': '', 'expire': ''}
  },
  {
    '_id': 4,
    'username': 'load1@test.com',
    'password': crypto.createHash('md5').update('password').digest('hex'),
    'email': 'load1@test.com',
    'name': 'Paolo',
    'surname': 'Rossi',
    'locale': 'it_IT',
    'lastLogin': new Date('2014-05-08T09:29:02.613Z'),
    'isAdmin': true,
    'isActive': true,
    'isDisabled': true,
    '_ts': {
      'created': new Date('2014-05-05T09:29:02.613Z'),
      'modified': new Date('2014-05-05T09:29:02.613Z'),
      'deleted': null
    },
    'resetPasswordToken': {
      'token': 'd5c18e6d8998e5271bdb6e1bb79941685ed1',
      'expire': 150000
    },
    'confirmationToken': {
      'token': 'd3c18e6d8998e5271bdb6e1bb79941685ed1',
      'expire': 150000
    },
    'autoLoginToken': {
      'token': 'abcde6d8998e5271bdb6e1bb79941685ed1b',
      'expire': 300000
    },
    'roles' : ['admin', 'guest']
  },
  {
    '_id': 5,
    'username': 'load2@test.com',
    'password': crypto.createHash('md5').update('password').digest('hex'),
    'email': 'load2@test.com',
    'name': 'Paolo',
    'surname': 'Rossi',
    'locale': 'it_IT',
    'lastLogin': new Date('2014-05-08T09:29:02.613Z'),
    'isAdmin': false,
    'isActive': false,
    'isDisabled': false,
    '_ts': {
      'created': new Date('2014-05-05T09:29:02.613Z'),
      'modified': new Date('2014-05-05T09:29:02.613Z'),
      'deleted': null
    }
  },
  {
    '_id': 6,
    'username': 'remember1@test.com',
    'password': crypto.createHash('md5').update('password').digest('hex'),
    'email': 'remember1@test.com',
    'name': 'Paolo',
    'surname': 'Rossi',
    'locale': 'it_IT',
    'lastLogin': new Date('2014-05-08T09:29:02.613Z'),
    'isAdmin': false,
    'isActive': false,
    'isDisabled': false,
    '_ts': {
      'created': new Date('2014-05-05T09:29:02.613Z'),
      'modified': new Date('2014-05-05T09:29:02.613Z'),
      'deleted': null
    },
    'rememberMeToken': {
      'token': 'rememberme998e5271bdb6e1bb79941685ed1b',
      'expire': Date.now() + 1500
    }
  }
];

exports.sequences = [
  {'_id': 'dfcore_users', 'seq': 7}
];
