const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('./models/users')

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true
}

var verifyJwtToken = function (req, jwtPayload, next) {
  //console.log('jwtPayload received = ' + jwtPayload);
  next(null, jwtPayload);
}

var jwtStrategy = new JwtStrategy(jwtOptions, verifyJwtToken)

passport.use(jwtStrategy);

module.exports = passport;
