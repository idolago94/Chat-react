var express = require('express');
var router = express.Router();
var redis = require('redis');

var client = redis.createClient();



router.post('/login', function(req, res, next) {
  if(req.body.password == 'codeOasis') {
    client.sismember('users', req.body.username, (err, reply) => {
      if(err) res.json(err);
      else {
        if(reply == 1) {
          res.send('username allready exist');
        }
        else {
          client.sadd('users', req.body.username, (err, reply) => {
            if(err) res.json(err);
            else res.redirect(`http://localhost:3001/main${req.body.username}`);
          })
        }
      }
    })
  }
  else {
    res.send('password wrong');
  }
});

router.post('/logout', function(req, res, next) {
  client.srem('users', req.body.user, (err, reply) => {
    if(err) res.json(err);
    else res.json(reply);
  })
});

router.get('/allusers', function(req, res, next) {
  client.smembers('users', (err, reply) => {
    if(err) res.json(err);
    else res.json(reply);
  });
});

module.exports = router;
