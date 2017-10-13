const express = require('express');
const uuid = require('node-uuid');
const msgpack = require('msgpack');

const router = express.Router();

module.exports = function (container) {

  /**
   * get label datastructure from redis
   * deserialize with msgpack
   */
  router.get('/lbl/workspace', (req, res) => {
    res.json({ ok: 'ok' });
  });

  /**
   * serialize post body with msgpack
   * put in redis
   */
  router.post('/lbl/workspace', (req, res) => {
    let payload = req.body;
    let b = msgpack.pack(payload);
    let key = new Buffer('pix2pix:facades:workspace');
    container.store.redisClient.setAsync(key, b).then(setres => {
      res.json({ ok: 'ok' });
    });
  });

  return router;
}
