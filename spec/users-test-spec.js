var request = require("request");

var base_url = "http://localhost:3000/"

describe('Users Tests', function () {

  var userId;
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
        url: base_url + 'api/users/user1',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }, function (error, response, body) {
        expect(response.statusCode).toBe(200)
        expect(body).not.toBe(null)
        json = JSON.parse(body)
        userId = json._id
        //console.log('userId in test is ' + userId)
        done()
      });
    });
  });

  it('Get user tickets pass', function (done) {
    request.get({
      url: base_url + `api/users/${userId}/tickets`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(200)
      expect(body).not.toBe(null)
      tickets = JSON.parse(body)
      expect(tickets.length).toBe(1)
      expect(tickets[0].subject).toBe('Sample Ticket-1')
      expect(tickets[0].details).toBe('Ticket-1')
      done()
    });
  });

  it('Get user tickets fail', function (done) {
    request.get({
      url: base_url + 'api/users/ffffffffffffffffffffffff/tickets',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(404)
      expect(JSON.parse(body).message).toBe('User with id ffffffffffffffffffffffff not found')
      done()
    });
  });
});
