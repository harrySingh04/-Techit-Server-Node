const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/users')
const Unit = require('../models/units')
const Ticket = require('../models/tickets')


require('dotenv').config()

async function encryptPassword(password, done) {
  await bcrypt.hash(password, 10, (err, hash) => {
    done(hash)
  })
}

var encryptedPassword

encryptPassword('abcd', (hash) => {
  encryptedPassword = hash
})

cysunUser = () => {
  return new User({
    name: {
      first: 'Dr. Chengyu',
      last: 'Sun'
    },
    username: 'cysun',
    password: encryptedPassword,
    department: 'CS',
    email: 'cysun@mail.com'
  })
}

user1 = () => {
  return new User({
    name: {
      first: 'User',
      last: '1'
    },
    username: 'user1',
    password: encryptedPassword,
    department: 'CS',
    email: 'user1@mail.com'
  })
}

user2 = () => {
  return new User({
    name: {
      first: 'User',
      last: '2'
    },
    username: 'user2',
    password: encryptedPassword,
    department: 'ME',
    email: 'user2@mail.com'
  })
}

technician1 = () => {
  return new User({
    name: {
      first: 'Technician',
      last: '1'
    },
    username: 'tech1',
    password: encryptedPassword,
    department: 'CS',
    email: 'tech1@mail.com',
    userRole: 'TECHNICIAN'
  })
}

technician2 = () => {
  return new User({
    name: {
      first: 'Technician',
      last: '2'
    },
    username: 'tech2',
    password: encryptedPassword,
    department: 'ME',
    email: 'tech2@mail.com',
    userRole: 'TECHNICIAN'
  })
}

supervisor1 = () => {
  return new User({
    name: {
      first: 'Supervisor',
      last: '1'
    },
    username: 'super1',
    password: encryptedPassword,
    department: 'CS',
    email: 'super1@mail.com',
    userRole: 'SUPERVISOR'
  })
}

unit1 = () => {
  return new Unit({
    name: 'CS',
    phone: '123456',
    email: 'unit1@mail.com',
    location: 'Los Angeles',
    description: 'Unit 1'
  })
}

ticket1 = () => {
  return new Ticket({
    subject: 'Sample Ticket-1',
    details: 'Ticket-1'
  })
}

ticket2 = () => {
  return new Ticket({
    subject: 'Sample Ticket-2',
    details: 'Ticket-2'
  })
}

ticket3 = () => {
  return new Ticket({
    subject: 'Ticket-1 for Anugular Test',
    details: 'Ticket-1 for Anugular Test'
  })
}

ticket4 = () => {
  return new Ticket({
    subject: 'Ticket-1 for Anugular Test',
    details: 'Ticket-2 for Anugular Test'
  })
}

async function saveAll() {
  await mongoose.connect(process.env.DBURL);

  ut1 = unit1()
  await ut1.save()

  us1 = user1()
  us1.unit = ut1._id
  await us1.save()

  us2 = user2()
  us2.unit = ut1._id
  await us2.save()

  us3 = cysunUser()
  us3.unit = ut1._id
  await us3.save()

  tc1 = technician1()
  tc1.unit = ut1._id
  await tc1.save()

  tc2 = technician2()
  tc2.unit = ut1._id
  await tc2.save()

  su1 = supervisor1()
  su1.unit = ut1._id
  await su1.save()

  tk1 = ticket1()
  tk1.unit = ut1._id
  tk1.requester = us1._id
  tk1.technicians = [tc1._id]
  tk1.supervisors = [su1._id]
  await tk1.save()

  tk2 = ticket2()
  tk2.unit = ut1._id
  tk2.requester = us2._id
  tk2.technicians = [tc1._id, tc2._id]
  tk2.supervisors = [su1._id]
  await tk2.save()

  tk3 = ticket3()
  tk3.unit = ut1._id
  tk3.requester = us3._id
  tk3.technicians = [tc1._id]
  tk3.supervisors = [su1._id]
  await tk3.save()

  tk4 = ticket4()
  tk4.unit = ut1._id
  tk4.requester = us3._id
  tk4.technicians = [tc1._id, tc2._id]
  tk4.supervisors = [su1._id]
  await tk4.save()

  await mongoose.disconnect();
}

saveAll()
