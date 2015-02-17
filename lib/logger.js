module.exports = {
  trace: function(message) {
    console.log('TRACE: ' + message + '\n');
  },
  info: function(message) {
    console.log('INFO: ' + message + '\n');
  },
  debug: function(message) {
    console.log('DEBUG: ' + message + '\n');
  },
  error: function(message) {
    console.log('ERROR: ' + message + '\n');
  }
};
