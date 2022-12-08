// {"web":{"client_id":"613472651879-6t5ep4p4no1tibpapurol6uq1v53b7pu.apps.googleusercontent.com",
//"project_id":"test1-370310","auth_uri":"https://accounts.google.com/o/oauth2/auth",
//"token_uri":"https://oauth2.googleapis.com/token",
//"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
// ,"redirect_uris":["https://localhost:3000/auth/google/callback"],"javascript_origins":["https://localhost:3000"]}}"
// client_secret":"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"


const express = require('express');
const passport = require('passport');
const app = express();

const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_CLIENT_ID = '613472651879-6t5ep4p4no1tibpapurol6uq1v53b7pu.apps.googleusercontent.com';
const callbackURL =  '/auth/google/callback';


var GoogleStrategy = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
  }
));


app.get('/auth/google',passport.authenticate('google',{
    scope : ['profile','email']
})) // data we need

app.get('/auth/google/callback',passport.authenticate('google'))

const PORT = process.env.PORT || 3000;

app.listen(PORT)