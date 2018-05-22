var express = require('express')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var User = require('../models/users')
var router = express.Router();

function checkPasswordMatch(inputPassword, hash, done) {
  bcrypt.compare(inputPassword, hash, function (err, res) {
    done(res)
  });
}

/* Login */
router.post('/', function (req, res, next) {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).send({
        message: "Missing username and/or password in request"
      });
    }
    console.log('login username = ' + req.body.username)
    User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err) {
        console.log('err = ' + err)
        res.status(500).send({
          message: "Login failure: " + err
        });
      } else {
        if (!user) {
          res.status(401).send({
            message: 'Invalid username and/or password'
          });
        } else {
          checkPasswordMatch(req.body.password, user.password, (match) => {
            if (match) {
              tokenBody = {
                id: user._id,
                role: user.userRole
              }
              token = jwt.sign(tokenBody, process.env.JWT_SECRET)
              res.status(200).send(token);
            } else {
              res.status(401).send({
                message: 'Invalid username and/or password'
              });
            }
          })
        }
      }
    })
  } catch (err) {
    if (err) {
      res.status(500).send({
        message: "Login failure: " + err
      });
    }
  }
});

module.exports = router;
