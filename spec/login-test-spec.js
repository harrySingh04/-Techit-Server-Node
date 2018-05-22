var request = require("request");

var base_url = "http://localhost:3000/"

describe('User Login Tests', function () {

  it('Test successful user login', function (done) {
    request.post({
      url: base_url + 'api/login',
      json: {
        username: 'user1',
        password: 'abcd'
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(200)
      expect(body).not.toBe(null)
      done()
    });
  });

  it('Test user login failure', function (done) {
    request.post({
      url: base_url + 'api/login',
      json: {
        username: 'user1',
        password: 'wrongpass'
      }
    }, function (error, response, body) {
      expect(response.statusCode).toBe(401)
      expect(body.message).toBe('Invalid username and/or password')
      done()
    });
  });

});
