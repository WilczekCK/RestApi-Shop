var bcrypt = require('bcrypt');
var jwtSecret = require('./jwtSecret');

var mysql = require('../controllers/mysql_controler');

const BCRYPT_SALT_ROUNDS = 12;

const passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  JWTstrategy = require('passport-jwt').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  'local-login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    async (username, password, done) => {

      console.log("CREDS")
      console.log(username)
      console.log(password)

      try{
        
        const userInfo = await mysql.showCertain( `users`, `*`, `email = '${username}'`);
        
        //console.log(userInfo)

        if (!userInfo.length) {
            return done(null, false, { message: "No user found" }); // req.flash is the way to set flashdata using connect-flash
        }
        if ( !bcrypt.compareSync(password, userInfo[0].password) )
            return done(null, false, { message: "Wrong pass" }); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, userInfo[0]);

      }
      catch(err){
        done(err)
      }
  })

)

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret,
};

passport.use(
  'jwt',
  new JWTstrategy(opts, async (jwt_payload, done) => {
    console.log('jwt_payload')
    console.log(jwt_payload)
    try {

      const userInfo = await mysql.showCertain( `users`, `*`, `id = '${jwt_payload.id}'`);

        if (userInfo.length > 0) {
          console.log('user found in db in passport');
          done(null, userInfo[0].id );
        } else {
          console.log('user not found in db');
          done(null, false);
        }

    } 
    catch (err) {
      done(err);
    }
  }),
)
