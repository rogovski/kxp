require('dotenv').config();

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
const container = require('./container');
const pix2pixFacadesRouteCtor = require('./src/routes/pix2pix/facades');

const app = express();
const server = http.Server(app);
const io = ioCons(server, { path: '/events' });

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
function broadcast(payload) {
  _.forEach(socket_collection, s => {
    s.emit('event_data', payload);
  });
}

app.post('/event', (req, res) => {
  // TODO: extract data from session
  const payload = req.body;
  broadcast(payload);
  return res.json({ message: 'ok' });
});

const pix2pixFacadesRoute = pix2pixFacadesRouteCtor(container);

app.use('/pix2pix/facades', pix2pixFacadesRoute);

container.initialize((err) => {
  if(err) {
    process.exit(1);
  }
  else {
    server.listen(container.store.srvPort, () => {
      console.log('SERVER RUNNING: ', container.store.srvPort);
    });
  }
});
