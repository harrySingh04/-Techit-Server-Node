const mongoose = require('mongoose')
const User = require('./users')
const Unit = require('./units')

var Schema = mongoose.Schema;

let ticketSchema = mongoose.Schema({
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  },
  technicians: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  supervisors: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  status: {
    type: String,
    required: true,
    default: 'OPEN'
  },
  priority: {
    type: String,
    required: true,
    default: 'NORMAL'
  },
  phone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  department: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: false
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastUpdateDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  completionDetails: {
    type: String,
    required: false
  },
  updates: [{
    modifiedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    details: {
      type: String,
      required: true
    },
    modifiedDate: {
      type: Date,
      required: true,
      default: Date.now
    }
  }]
})

let Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket
