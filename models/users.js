const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let userSchema = mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: false
  },
  department: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true,
    default: 'USER'
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  }
})

let User = mongoose.model('User', userSchema)

module.exports = User
