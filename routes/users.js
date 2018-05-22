var express = require('express');
var router = express.Router();
var User = require('../models/users')
var Ticket = require('../models/tickets')

/* GET user tickets. */
router.get('/:userId/tickets', function (req, res, next) {
  try {
    userId = req.params.userId
    User.findById(userId, (err, user) => {
      if (err) {
        res.status(400).send({
          message: 'Invalid user id ' + userId + ': ' + err
        })
      } else if (!user) {
        res.status(404).send({
          message: 'User with id ' + userId + ' not found'
        })
      } else {
        Ticket.find({
          requester: user._id
        }, (err, tickets) => {
          if (err) {
            res.status(500).send({
              message: 'Error finding tickets for user with id ' + userId + ': ' + err
            })
          } else {
            res.status(200).send(tickets)
          }
        })
      }
    })
  } catch (err) {
    res.status(500).send({
      message: 'Error finding tickets for user with id ' + userId + ': ' + err
    })
  }
});

/* Get user by username */
/* Needed for test case */
router.get('/:username', function (req, res, next) {
  try {
    username = req.params.username
    User.findOne({
      username: username
    }, (err, user) => {
      if (err) {
        res.status(500).send({
          message: 'Error finding user with username ' + username + ': ' + err
        })
      } else if (!user) {
        res.status(404).send({
          message: 'User with username ' + username + ' not found'
        })
      } else {
        res.status(200).send(user)
      }
    })
  } catch (err) {
    res.status(500).send({
      message: 'Error finding user with username ' + username + ': ' + err
    })
  }
});

module.exports = router;
