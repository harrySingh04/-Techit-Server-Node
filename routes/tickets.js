var express = require('express');
var router = express.Router();
var Unit = require('../models/units')
var User = require('../models/users')
var Ticket = require('../models/tickets')

var validTicketStatuses = ['OPEN', 'INPROGRESS', 'ONHOLD', 'COMPLETED', 'CLOSED']
var validTicketPriorities = ['NA', 'LOW', 'MEDIUM', 'HIGH']

/* Create Ticket */
router.post('/', function (req, res, next) {
  try {
    ticket = new Ticket(req.body)
    ticket.requester = req.user.id
    ticket.save((err, createdTicket) => {
      if (err) {
        res.status(400).send({
          message: "Invalid ticket payload: " + err
        });
      } else {
        res.status(200).send(createdTicket);
      }
    })
  } catch (err) {
    if (err) {
      res.status(500).send({
        message: "Create ticket failure: " + err
      });
    }
  }
});

/* GET ticket technicians listing. */
router.get('/:ticketId/technicians', function (req, res, next) {
  try {
    ticketId = req.params.ticketId
    //console.log('GetTicketTechnicians.ticketId = ' + ticketId)
    Ticket.findById(ticketId, (err, ticket) => {
      if (err) {
        res.status(400).send({
          message: 'Invalid ticket id ' + ticketId + ': ' + err
        })
      } else if (!ticket) {
        res.status(404).send({
          message: 'Ticket with id ' + ticketId + ' not found'
        })
      } else {
        //console.log(ticket.technicians)
        User.find({
          _id: {
            $in: ticket.technicians
          },
          userRole: 'TECHNICIAN'
        }, (err, tickets) => {
          if (err) {
            res.status(500).send({
              message: 'Error finding ticket with id ' + ticketId + ': ' + err
            })
          } else {
            res.status(200).send(tickets)
          }
        })
      }
    })
  } catch (err) {
    res.status(500).send({
      message: 'Error finding technicians for ticket with id ' + ticketId + ': ' + err
    })
  }
});

function validateTicketUpdate(ticketId, user, res, done) {
  //console.log('user = ' + user)
  if (user.role != 'TECHNICIAN' && user.role != 'SUPERVISOR') {
    Ticket.findById(ticketId, (err, ticket) => {
      if (!err) {
        //console.log('ticket.requester = ' + ticket.requester)
        //console.log('user.id = ' + user.id)
        if (ticket.requester != user.id) {
          res.status(403).send({
            message: 'Logged in user can not update other user\'s tickets'
          })
        } else {
          done()
        }
      } else {
        res.status(500).send({
          message: 'Ticket update validation failed: ' + err
        })
      }
    })
  } else {
    done()
  }
}

/* Update ticket status. */
router.put('/:ticketId/status/:status', function (req, res, next) {
  try {
    ticketId = req.params.ticketId
    status = req.params.status
    //console.log('UpdateTicketStatus.status = ' + status)
    if (!validTicketStatuses.includes(status)) {
      res.status(400).send({
        message: 'Invalid ticket status ' + status
      })
    } else {
      validateTicketUpdate(ticketId, req.user, res, () => {
        Ticket.update({
          _id: ticketId
        }, {
          $set: {
            status: status
          },
          $push: {
            updates: {
              modifiedUser: req.user.id,
              modifiedDate: new Date(),
              details: !req.body ? 'Status updated to ' + status : 'Status updated to ' + status + '. Comments: ' + JSON.stringify(req.body)
            }
          }
        }, (err, ticket) => {
          if (err) {
            res.status(500).send({
              message: 'Error updating status for ticket with id: ' + ticketId + ': ' + err
            })
          } else {
            res.status(200).send(ticket)
          }
        })
      })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error updating status for ticket with id: ' + ticketId + ': ' + err
    })
  }
});

/* Update ticket priority. */
router.put('/:ticketId/priority/:priority', function (req, res, next) {
  try {
    ticketId = req.params.ticketId
    priority = req.params.priority
    //console.log('UpdateTicketPriority.priority = ' + priority)
    if (!validTicketPriorities.includes(priority)) {
      res.status(400).send({
        message: 'Invalid ticket priority ' + priority
      })
    } else {
      validateTicketUpdate(ticketId, req.user, res, () => {
        Ticket.update({
          _id: ticketId
        }, {
          $set: {
            priority: priority
          },
          $push: {
            updates: {
              modifiedUser: req.user.id,
              modifiedDate: new Date(),
              details: !req.body ? 'Priotity updated to ' + priority : 'Priotity updated to ' + priority + '. Comments: ' + JSON.stringify(req.body)
            }
          }
        }, (err, ticket) => {
          if (err) {
            res.status(500).send({
              message: 'Error updating priority for ticket with id: ' + ticketId + ': ' + err
            })
          } else {
            res.status(200).send(ticket)
          }
        })
      })
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error updating priority for ticket with id: ' + ticketId + ': ' + err
    })
  }
});

/* GET logged-in user tickets. */
router.get('/', function (req, res, next) {
  try {
    userId = req.user.id
    User.findById(userId, (err, user) => {
      if (err) {
        res.status(400).json({
          message: 'Invalid user id ' + userId + ': ' + err
        })
      } else if (!user) {
        res.status(404).json({
          message: 'User with id ' + userId + ' not found'
        })
      } else {
        Ticket.find({
          requester: user._id
        }, (err, tickets) => {
          if (err) {
            res.status(500).json({
              message: 'Error finding tickets for user with id ' + userId + ': ' + err
            })
          } else {
            res.status(200).json(tickets)
          }
        })
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'Error finding tickets for user with id ' + userId + ': ' + err
    })
  }
});

/* GET ticket by id. */
router.get('/:ticketId', function (req, res, next) {
  try {
    ticketId = req.params.ticketId
    Ticket.findById(ticketId, (err, ticket) => {
      if (err) {
        res.status(500).json({
          message: 'Error finding ticket with id ' + ticketId + ': ' + err
        })
      } else if (!ticket) {
        res.status(404).json({
          message: 'Ticket not found with id ' + ticketId
        })
      } else {
        res.status(200).json(ticket)
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'Error finding ticket with id ' + ticketId + ': ' + err
    })
  }
});

module.exports = router;
