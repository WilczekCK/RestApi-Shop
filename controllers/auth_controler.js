var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var flash = require('req-flash');
var mysql = require('./mysql_controler');

var auth_controler = auth_controler || {}
auth_controler = {
    passport: {
        config: function(){ 
            passport.serializeUser(function(user, done) {
                done(null, user.id);
            });
        
            passport.deserializeUser(async function(id, done) {
                const userinfo = await mysql.show(`SELECT * FROM users WHERE id = ${id}`);
                if(userInfo.length) return done(userinfo);
                else return console.log('Something went wrong');
            });
        },
        localSignUp: function(req){
            console.log(req)
            passport.use(
                'local-signup',
                new LocalStrategy({
                    usernameField : 'username',
                    passwordField : 'password',
                },
                async function(req, username, password, done) {
                    const userInfo = await mysql.show(`SELECT * FROM users WHERE email = ${email}`);
                        if (userInfo.length) {
                            done(null, false);
                            return 'There is already a user with that email'
                        } else {
                            var newUserMysql = {
                                username: username,
                                password: password
                            };

                            await mysql.insert(`users`, `username, password`, `${newUserMysql.username, newUserMysql.password}`);
                            return done(null, newUserMysql);
                        }
                })
            )
        },
        init: function(){ 
            auth_controler.passport.config();
            auth_controler.passport.localSignUp();
        }

       
        
    },
    login: {

    },
    register: {

    },
    forgotPassword: {
        
    }
}


module.exports = auth_controler || 'Auth Controler Problem!';