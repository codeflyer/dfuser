var Promise = require('bluebird');

function Mailer() {
  this.from = 'mailer_not_init@mailer.com';
  this.to = '';
  this.cc = '';
  this.bcc = 'mailer_not_init@mailer.com';
  this.subject = '';
  this.bodyHtml = '';
}

var callback = null;

Mailer.setSendMailCallback = function(cb) {
  callback = cb;
};

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
    var to = this.to;
    var from = 'test@testmail.com';
    if (callback != null) {
      callback({
        Source: from,
        Destination: {ToAddresses: [to], BccAddresses: [this.bcc]},
        Message: {
          Subject: {
            Data: this.subject
          },
          Body: {
            Html: {
              Data: this.bodyHtml
            }
          }
        }
      });
    }
  }
};

module.exports = Mailer;
