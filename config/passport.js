var bcrypt = require('bcrypt');
var jwtSecret = 'jwtSecret';

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

// passport.use(
//   'local-register',
//   new localStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password',
//       session: false,
//     },
//     (username, password, done) => {
//       try {
//         User.findOne({
//           where: {
//             username: username,
//           },
//         }).then(user => {
//           if (user != null) {
//             console.log('username already taken');
//             return done(null, false, { message: 'username already taken' });
//           } else {
//             bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
//               User.create({ username, password: hashedPassword }).then(user => {
//                 console.log('user created');
//                 // note the return needed with passport local - remove this return for passport JWT to work
//                 return done(null, user);
//               });
//             });
//           }
//         });
//       } catch (err) {
//         done(err);
//       }
//     },
//   ),
// );



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
  secretOrKey: 'jwtSecret',
};

// passport.use(
//   'jwt',
//   new JWTstrategy(opts, (jwt_payload, done) => {
//     try {
//       User.findOne({
//         where: {
//           username: jwt_payload.id,
//         },
//       }).then(user => {
//         if (user) {
//           console.log('user found in db in passport');
//           // note the return removed with passport JWT - add this return for passport local
//           done(null, user);
//         } else {
//           console.log('user not found in db');
//           done(null, false);
//         }
//       });
//     } catch (err) {
//       done(err);
//     }
//   }),
// );