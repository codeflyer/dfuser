var Promise = require('bluebird');

function Mailer() {
  this.from = 'mailer_not_init@mailer.com';
  this.to = '';
  this.cc = '';
  this.bcc = 'mailer_not_init@mailer.com';
  this.subject = '';
  this.bodyHtml = '';
}

Mailer.prototype = {
  constructor: Mailer,

  /**
   * Set to param
   * @param {String} to
   */
  setTo: function(to) {
    this.to = to;
  },

  /**
   * Set cc param
   * @param {String} cc
   */
  setCc: function(cc) {
    this.cc = cc;
  },

  /**
   * Set subject param
   * @param {String} subject
   */
  setSubject: function(subject) {
    this.subject = subject;
  },

  /**
   * Set bodyHtml param
   * @param {String} html
   */
  setBodyHtml: function(html) {
    this.bodyHtml = html;
  },

  /**
   * Set bodyText param
   * @param {String} text
   */
  setBodyText: function(text) {
    this.bodyText = text;
  },

  /**
   * Set autoConvertText param
   * If true convert automatically bodyHtml to text
   */
  setAutoConvertText: function() {
    this.autoConvertText = true;
  },

  /**
   * Send mail
   */
  sendMail: function() {
    var logger = require('./di').getLogger();
    logger.error('The mailer module wasn\'t defined');
    console.log('The mailer module wasn\'t defined');
    return Promise.reject('The mailer module wasn\'t defined');
  }
};

module.exports = Mailer;
