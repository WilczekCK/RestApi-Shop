var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy,
  JWTstrategy = require('passport-jwt').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt;

var jwt = require('jsonwebtoken')
var flash = require('req-flash');
var mysql = require('./mysql_controler');

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: 'jwtSecret.secret',
};

var auth_controler = auth_controler || {}
auth_controler = {
    passport: {
        // config: function(){ 
        //     passport.serializeUser(function(user, next) {
        //         let id = user._id;
        //         user_cache[id] = user;
        //         next(null, id);
        //       });
              
        //       passport.deserializeUser(function(id, next) {
        //         next(null, user_cache[id]);
        //       });
        // },
        // localSignUp: function(req){
        //     console.log(req)
        //     passport.use(
        //         'local-signup',
        //         new LocalStrategy({
        //             usernameField : 'username',
        //             passwordField : 'password',
        //         },
        //         async function(req, username, password, done) {
        //             const userInfo = await mysql.show(`SELECT * FROM users WHERE email = ${email}`);
        //                 if (userInfo.length) {
        //                     done(null, false);
        //                     return 'There is already a user with that email'
        //                 } else {
        //                     var newUserMysql = {
        //                         username: username,
        //                         password: password
        //                     };

        //                     await mysql.insert(`users`, `username, password`, `${newUserMysql.username, newUserMysql.password}`);
        //                     return done(null, newUserMysql);
        //                 }
        //         })
        //     )
        // },

        // localLogin: function(req){
        //     passport.use(
        //         'local-login',
        //         new LocalStrategy({
        //                 // by default, local strategy uses username and password, we will override with email
        //                 usernameField : 'email',
        //                 passwordField : 'password',
        //                 session: false // allows us to pass back the entire request to the callback
        //         },
        //         async function(username, password, done) { // callback with email and password from our form
                        
        //                 const userInfo = await mysql.showCertain( `users`, `*`, `email = ${username}`);
                        
        //                     if (err) return done(err);

        //                     if (!userInfo.length) {
        //                         return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        //                     }
        //                     if ( !bcrypt.compareSync(password, userInfo.password) )
        //                         return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        
        //                     // all is well, return successful user
        //                     console.log(" HUJCZE ")
        //                     return done(null, userInfo);
                            
        //             }    
        //         )
        //     )
        // },

        // jwtStrategy: function(req){
            
        //     passport.use(
        //         'jwt',
        //         new JWTstrategy(opts, (jwt_payload, done) => {
        //             try {
        //             User.findOne({
        //                 where: {
        //                 username: jwt_payload.id,
        //                 },
        //             }).then(user => {
        //                 if (user) {
        //                 console.log('user found in db in passport');
        //                 // note the return removed with passport JWT - add this return for passport local
        //                 done(null, user);
        //                 } else {
        //                 console.log('user not found in db');
        //                 done(null, false);
        //                 }
        //             });
        //             } catch (err) {
        //             done(err);
        //             }
        //         }),
        //     )                
        // },

        
        // init: function(){ 
        //     auth_controler.passport.config();
        //     // auth_controler.passport.localSignUp();
        //     auth_controler.passport.localLogin();
        //     auth_controler.passport.jwtStrategy();
        // },
    },

},
    // register: {

    // },
    // forgotPassword: {
        
    // }



module.exports = auth_controler || 'Auth Controler Problem!';