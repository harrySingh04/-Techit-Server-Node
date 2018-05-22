var request = require("request");

var base_url = "http://localhost:3000/"

describe('Ticket Tests', function () {

  var ticketId1, ticketId2;
  var userToken1, userToken2, techToken1;

  function getUserToken(username, done) {
    request.post({
      url: base_url + 'api/login',
      json: {
        username: username,
        password: 'abcd'
      }
    }, function (error, response, body) {
      if (error) {
        throw error
      } else {
        done(body)
      }
    });
  }

  function getUserTokenAndTicket(username, done) {
    var token, ticketId
    request.post({
      url: base_url + 'api/login',
      json: {
        username: username,
        password: 'abcd'
      }
    }, function (error, response, body) {
      if (error) {
        throw error
      }
      token = body
      request.get({
        url: base_url + 'api/users/' + username,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }, function (error, response, body) {
        expect(response.statusCode).toBe(200)
        expect(body).not.toBe(null)
        json = JSON.parse(body)
        request.get({
          url: base_url + `api/users/${json._id}/tickets`,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }, function (error, response, body) {
          expect(response.statusCode).toBe(200)
          expect(body).not.toBe(null)
          json = JSON.parse(body)
          ticketId = json[0]._id
          done(token, ticketId)
        });
        done(token, ticketId)
      });
    });
  }

  beforeAll(function (done) {
    getUserTokenAndTicket('user1', (token, ticketId) => {
      userToken1 = token
      ticketId1 = ticketId
      getUserTokenAndTicket('user2', (token, ticketId) => {
        userToken2 = token
        ticketId2 = ticketId
        getUserToken('tech1', (token) => {
          techToken1 = token
          //console.log('ticketId1 = ' + ticketId1)
          //console.log('ticketId2 = ' + ticketId1)
          //console.log('userToken1 = ' + userToken1)
          //console.log('userToken2 = ' + userToken2)
          done()
        })
      })
    })
  });

  it('Create ticket pass', function (done) {
    request.post({
      url: base_url + 'api/tickets',
      headers: {
        'Authorization': 'Bearer ' + userToken2,
        'content-type': 'application/json',
      },
      json: {
        subject: 'Test Ticket-5',
        details: 'Ticket-5'
      }
    }, (err, res, body) => {
      expect(res.statusCode).toBe(200)
      expect(body).not.toBe(null)
      expect(body.subject).toBe('Test Ticket-5')
      expect(body.details).toBe('Ticket-5')
      done()
    })
  })

  it('Create ticket fail', function (done) {
    request.post({
      url: base_url + 'api/tickets',
      headers: {
        'Authorization': 'Bearer ' + userToken2,
        'content-type': 'application/json',
      },
      json: {
        details: 'Ticket-5'
      }
    }, (err, res, body) => {
      expect(res.statusCode).toBe(400)
      expect(body).not.toBe(null)
      expect(body.message).toContain('Invalid ticket payload:')
      done()
    })
  })

  it('Get ticket technicians pass', function (done) {
    request.get({
      url: base_url + `api/tickets/${ticketId1}/technicians`,
      headers: {
        'Authorization': 'Bearer ' + userToken1
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(200)
      expect(body).not.toBe(null)
      technicians = JSON.parse(body)
      expect(technicians.length).toBe(1)
      expect(technicians[0].username).toBe('tech1')
      expect(technicians[0].department).toBe('CS')
      done()
    });
  });

  it('Get ticket technicians fail', function (done) {
    request.get({
      url: base_url + 'api/tickets/123/technicians',
      headers: {
        'Authorization': 'Bearer ' + userToken1
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(body).message).toContain('Invalid ticket id 123:')
      done()
    });
  });

  it('Update ticket status pass', function (done) {
    request.put({
      url: base_url + `api/tickets/${ticketId1}/status/CLOSED`,
      headers: {
        'Authorization': 'Bearer ' + userToken1
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(200)
      expect(body).not.toBe(null)
      result = JSON.parse(body)
      expect(result.ok).toBe(1)
      expect([0, 1]).toContain(result.nModified)
      done()
    });
  });

  it('Update ticket status fail', function (done) {
    request.put({
      url: base_url + `api/tickets/${ticketId2}/status/CLOSED`,
      headers: {
        'Authorization': 'Bearer ' + userToken1
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(403)
      expect(body).not.toBe(null)
      expect(JSON.parse(body).message).toBe('Logged in user can not update other user\'s tickets')
      done()
    });
  });

  it('Update ticket priority pass', function (done) {
    request.put({
      url: base_url + `api/tickets/${ticketId2}/priority/HIGH`,
      headers: {
        'Authorization': 'Bearer ' + techToken1
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(200)
      expect(body).not.toBe(null)
      result = JSON.parse(body)
      expect(result.ok).toBe(1)
      expect([0, 1]).toContain(result.nModified)
      done()
    });
  });

  it('Update ticket priority fail', function (done) {
    request.put({
      url: base_url + `api/tickets/${ticketId2}/priority/WRONG_PRIORITY`,
      headers: {
        'Authorization': 'Bearer ' + userToken2
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(400)
      expect(body).not.toBe(null)
      expect(JSON.parse(body).message).toBe('Invalid ticket priority WRONG_PRIORITY')
      done()
    });
  });
});
