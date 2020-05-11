var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy,
  JWTstrategy = require('passport-jwt').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt;
  jwtSecret = require('./../config/jwtSecret');

var jwt = require('jsonwebtoken')
var flash = require('req-flash');
var mysql = require('./mysql_controler');
var profile = require('./profile_controler')
const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtSecret,
};

var auth_controler = auth_controler || {}
auth_controler = {

    authenticate: (req, res, next)=>{

        return new Promise( (resolve, reject )=>{
    
            passport.authenticate('jwt', { session: false }, async(err, user, info) => {
                if(err) {
                    console.log(err);
                    reject(err)
                }
                if(req.body.id !== user.id ){
                    res.status(401).send('Authorization error');
                    reject('Authorization error')
                } 
                if(info != undefined) {
                    res.status(401).send(info.message);
                    reject(info.message)
                } 
                else{
                    console.log(user)
                    console.log('user')
                    resolve( user );
                }
            })(req, res, next);
    
        } )
    
    },

    login: (req, res, next) => {

        return new Promise( (resolve, reject )=>{

            passport.authenticate('local-login', async (err, user, info) => {

                if(err) {
                    console.log(err);
                    reject(err);
                }
                if(info != undefined) {
                    res.status(401).send(info.message);
                    reject(info.message);
                } 
                else {
                    req.logIn(user, async err => {
                        if (err) throw err
        
                        let foundUser = await profile.lookForProfile(`email = '${user.email}'`);
                        const token = jwt.sign({ id: foundUser[0].id }, jwtSecret);
        
                        resolve({ auth: true, token: token, message: 'user logged in successfully' });
                    });
                }
            })(req, res, next);

        } )
    }
},

module.exports = auth_controler || 'Auth Controler Problem!';