var request = require("request");

var base_url = "http://localhost:3000/"

describe('Unit Tests', function () {

  var unitId;
  var token;

  beforeAll(function (done) {
    request.post({
      url: base_url + 'api/login',
      json: {
        username: 'user1',
        password: 'abcd'
      }
    }, function (error, response, body) {
      if (error) {
        throw error
      }
      token = body
      request.get({
        url: base_url + 'api/units/CS',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }, function (error, response, body) {
        expect(response.statusCode).toBe(200)
        expect(body).not.toBe(null)
        json = JSON.parse(body)
        unitId = json._id
        //console.log('unitId in test is ' + unitId)
        done()
      });
    });
  });

  it('Get unit tickets pass', function (done) {
    request.get({
      url: base_url + `api/units/${unitId}/tickets`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(200)
      expect(body).not.toBe(null)
      tickets = JSON.parse(body)
      expect(tickets.length).toBe(4)
      expect(tickets[0].subject).toBe('Sample Ticket-1')
      expect(tickets[0].details).toBe('Ticket-1')
      done()
    });
  });

  it('Get unit tickets fail', function (done) {
    request.get({
      url: base_url + 'api/units/123/tickets',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(body).message).toContain('Invalid unit id 123:')
      done()
    });
  });

  it('Get unit technicians pass', function (done) {
    request.get({
      url: base_url + `api/units/${unitId}/technicians`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(200)
      expect(body).not.toBe(null)
      tickets = JSON.parse(body)
      expect(tickets.length).toBe(2)
      expect([tickets[0].username, tickets[1].username]).toContain('tech1')
      expect([tickets[0].username, tickets[1].username]).toContain('tech2')
      expect(tickets[0].userRole).toBe('TECHNICIAN')
      done()
    });
  });

  it('Get unit technicians fail', function (done) {
    request.get({
      url: base_url + 'api/units/ffffffffffffffffffffffff/technicians',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(404)
      expect(JSON.parse(body).message).toContain('Unit with id ffffffffffffffffffffffff not found')
      done()
    });
  });
});
