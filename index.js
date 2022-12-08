const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dbConnect = require('./mongdb.js')

require('./auth')

const app = express();
app.use(session({secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());


const isLoggedIn = (req,res,next) =>{
    req.user ? next() : res.sendStatus(401);
}

app.get('/',(req,res)=>{
    res.send('<a href="/auth/google">Authenticate with google</a>')
})


app.get('/auth/google',
    passport.authenticate('google',{scope : ['email','profile']})
)

app.get('/google/callback',
    passport.authenticate('google',{
        successRedirect: '/protected',
        failureRedirect: '/auth/failure',
    })
)

app.get('/auth/failure',(req,res)=>{
    res.send('something went wrong...')
})




app.get('/protected',isLoggedIn,async (req,res)=>{
    const person = { name : req.user.displayName, email : req.user.emails[0].value}
    const data = await dbConnect();
    const isThere = await data.count(person, { limit: 1 });

    if(!isThere) {
        const result = await data.insertOne(person)
        if(result.acknowledged) console.log('data Inserted');
        res.send(`Hello ${req.user.displayName} Email id : ${req.user.emails[0].value} is added in mongoDB table`);
    }
    else {
        res.send(`Hello ${req.user.displayName} Email id : ${req.user.emails[0].value} already in mongoDB table`)
    }
})



app.get('/logout',(req,res)=>{
    // req.logOut();
    req.session.destroy();
    res.send('Goodbye!')
})
app.listen(5000)
