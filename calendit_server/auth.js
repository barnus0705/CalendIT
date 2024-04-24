const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const clientId = '985996713619-7k7kho0av4u3p63ece5g2o8nbb8e7gcf.apps.googleusercontent.com';
const secret = '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';

passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: secret,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    function (done, profile){
        return done(null,profile);
    }
));

passport.serializeUser((user, done) =>{
    done(null, user);
})
passport.deserializeUser((obj, done) =>{
    done(null, obj);
})