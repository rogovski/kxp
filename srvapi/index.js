//require('dotenv').config();

const express = require('express');
const http = require('http');
const uuid = require('node-uuid');
const moment = require('moment');
const promise = require('bluebird');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = promise.promisifyAll(require('fs'));
//const sharp = require('sharp');
const _ = require('lodash');
const ioCons = require('socket.io');
const redis = require('redis');

const app = express();
const server = http.Server(app);
const io = ioCons(server, { path: '/events' });

/**
 * setup redis to use bluebird
 */
promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

/**
 * initialize redis client
 */
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
  detect_buffers: true
});

/**
 * enable json encoded bodies
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * serve static
 */
app.use('/static', express.static('static'));

/**
 * morgan logger
 */
app.use(morgan('dev'));


/**
 * socket
 */

var socket_collection = {};

io.on('connection', (socket) => {
  let tmpid = uuid.v4();
  console.log('adding connection to collection');
  socket_collection[tmpid] = socket;
  
  socket.on('disconnect', () => {
    console.log('removing connection from collection');
    if(_.has(socket_collection, tmpid)) {
      delete socket_collection[tmpid];
    }
  });
});

/**
 * index route
 */
app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

/**
 * command
 * there are two types of entities that can acccess this endpoint.
 * users and workers. a command issuesd by a user creates a job id.
 *
 */
function broadcast() {

}

app.post('/cmd/:id', (req, res) => {
  // TODO: extract data from session
  const id = req.params.id;
  const payload = req.body;

  if(_.has(payload, 'user_id')) {
    // user. user wants to run a job
    return res.json({ user_id: user_id, id: id, payload: payload });
  }
  else {
    // worker. broadcast message to appropriate socket
    return res.json({ user_id: user_id, id: id, payload: payload });
  }
});

server.listen(8484, () => {
  console.log('SERVER RUNNING: ', 8484);
});