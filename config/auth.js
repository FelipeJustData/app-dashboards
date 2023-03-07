const localStrategy  = require("passport-local").Strategy
const bcrypt = require("bcryptjs")



// Model User
const User = require("../models/User")

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {

        User.findOne({where: {email: email}}).then((user) => {
            if(!user){
                return done(null, false, {message: "Conta não existe"})
            }

            bcrypt.compare(password, user.password, (error, equals) => {
                if(equals){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))

    //gravando dados do usuário na sessão
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });

}