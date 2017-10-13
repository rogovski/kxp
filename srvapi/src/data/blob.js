const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

module.exports = function (config) {
  return new AWS.S3(config);
};
