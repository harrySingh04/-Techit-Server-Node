var express = require('express');
var router = express.Router();
var Unit = require('../models/units')
var User = require('../models/users')
var Ticket = require('../models/tickets')

/* GET unit tickets listing. */
router.get('/:unitId/tickets', function (req, res, next) {
  try {
    unitId = req.params.unitId
    //console.log('GetUnitTickets.unitId = ' + unitId)
    Unit.findById(unitId, (err, unit) => {
      if (err) {
        res.status(400).send({
          message: 'Invalid unit id ' + unitId + ': ' + err
        })
      } else if (!unit) {
        res.status(404).send({
          message: 'Unit with id ' + unitId + ' not found'
        })
      } else {
        Ticket.find({
          unit: unit._id
        }, (err, tickets) => {
          if (err) {
            res.status(500).send({
              message: 'Error finding unit with id ' + unitId + ': ' + err
            })
          } else {
            res.status(200).send(tickets)
          }
        })
      }
    })
  } catch (err) {
    res.status(500).send({
      message: 'Error finding tickets for unit with id ' + unitId + ': ' + err
    })
  }
});

/* GET unit technicians listing. */
router.get('/:unitId/technicians', function (req, res, next) {
  try {
    unitId = req.params.unitId
    //console.log('GetUnitTechnicians.unitId = ' + unitId)
    Unit.findById(unitId, (err, unit) => {
      if (err) {
        res.status(400).send({
          message: 'Invalid unit id ' + unitId + ': ' + err
        })
      } else if (!unit) {
        res.status(404).send({
          message: 'Unit with id ' + unitId + ' not found'
        })
      } else {
        User.find({
          unit: unit._id,
          userRole: 'TECHNICIAN'
        }, (err, tickets) => {
          if (err) {
            res.status(500).send({
              message: 'Error finding unit with id ' + unitId + ': ' + err
            })
          } else {
            res.status(200).send(tickets)
          }
        })
      }
    })
  } catch (err) {
    res.status(500).send({
      message: 'Error finding technicians for unit with id ' + unitId + ': ' + err
    })
  }
});

/* Get unit by unitname */
/* Needed for test case */
router.get('/:unitname', function (req, res, next) {
  try {
    unitname = req.params.unitname
    Unit.findOne({
      name: unitname
    }, (err, unit) => {
      if (err) {
        res.status(500).send({
          message: 'Error finding unituser with name ' + unitname + ': ' + err
        })
      } else if (!unit) {
        res.status(404).send({
          message: 'Unit with name ' + unitname + ' not found'
        })
      } else {
        res.status(200).send(unit)
      }
    })
  } catch (err) {
    res.status(500).send({
      message: 'Error finding unit with name ' + unitname + ': ' + err
    })
  }
});

/* Get all units */
/* Needed for angular */
router.get('/', function (req, res, next) {
  try {
    unitname = req.params.unitname
    Unit.find((err, units) => {
      if (err) {
        res.status(500).json({
          message: 'Error finding units ' + ': ' + err
        })
      } else {
        res.status(200).json(units)
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'Error finding units ' + ': ' + err
    })
  }
});

module.exports = router;
