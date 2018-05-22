const mongoose = require('mongoose')
const User = require('./users')
const Ticket = require('./tickets')
var Schema = mongoose.Schema;

let unitSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  }
})

let Unit = mongoose.model('Unit', unitSchema)

module.exports = Unit
