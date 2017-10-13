
const mongoose = require('mongoose'); //.set("debug",true);
const mongoosePaginate = require('mongoose-paginate');
const promise = require('bluebird');
// const userModel = require('./src/data/user');
const blobCtor = require('./src/data/blob');
const path = require('path');
const _ = require('lodash');
const AWS = require('aws-sdk');
const redis = require('redis');

/**
 * setup mongoose to use bluebird
 */
mongoose.Promise = promise;

/**
 * setup redis to use bluebird
 */
promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

/**
 * initialize redis client
 */
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  detect_buffers: true
});

/**
 * init session, use base redis object
 * used for browser based interaction with app
 */
const browserSessionInit = {
  secret:"test",
  // create new redis store.
  store: { 
    host: process.env.REDIS_HOST, 
    port: process.env.REDIS_PORT, 
    client: redisClient, 
    prefix: 'browsersess:',
    ttl: process.env.SESSION_TIMEOUT
  },
  saveUninitialized: false,
  resave: false
};
exports.browserSessionInit = browserSessionInit;

/**
 * basic mongo connection string with no authentication
 */
function connStrBasic(configObject) {
  var host = configObject.host + ':' + configObject.port;
  return 'mongodb://' + path.join(host, configObject.db);
}

/**
 * mongo connection info
 */
const mongoConfig = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  db: process.env.MONGO_DB
};

/**
 * blob connection info
 */
function blobConfig(configtype) {
  let base_options = {
      apiVersion: '2006-03-01',
      region: 'us-east-1',
      accessKeyId: process.env.BLOB_KEY,
      secretAccessKey: process.env.BLOB_SECRET
  };
  if (_.has(process.env, 'BLOB_HOST')) {
    base_options.s3ForcePathStyle = true;
    base_options.endpoint = new AWS.Endpoint(process.env.BLOB_HOST);
  }
  return blobCtor(base_options);
}

/**
 * location on webserver of upload directory.
 * every file uploaded gets buffered to this directory
 * before it gets moved to blob storage
 */
const uploadFsBufferPath = path.join(__dirname, 'uploads');

/**
 * container reference
 */
var store = {};
exports.store = store;

/**
 * initialize mongo models
 */
exports.initialize = function (next) {
  var connStr = connStrBasic(mongoConfig);

  var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
  };

  var conn = mongoose.createConnection(connStr, options);

  conn.on('error', console.error.bind(console, 'connection error:'));

  conn.once('open', () => {
    store.uploadFsBufferPath = uploadFsBufferPath;
    store.srvPort = process.env.SERVER_PORT;

    store.blob = blobConfig(process.env.BLOB_ENV);

    store.redisClient = redisClient;

    /*
    var userSchema = new mongoose.Schema(userModel.schema);
    userSchema.plugin(mongoosePaginate);
    store[userModel.name] = userModel
      .initialize(conn.model(userModel.name, userSchema));
    */

    next(false);
  });
}
