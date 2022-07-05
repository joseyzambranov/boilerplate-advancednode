'use strict';
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const ObjectID = require('mongodb').ObjectID;

const app = express();

fccTesting(app); //For FCC testing purposes
app.set('view engine', 'pug')
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.route('/').get((req, res) => {
  res.render(process.cwd() + '/views/pug/index', {title:'Hello',message:"Please login"});
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:true,
  saveUninitialized:true,
  cookie:{secure:false}
}));

passport.serializeUser((user,done)=>{
  done(null,user._id)
})

passport.deserializeUser((user,done)=>{
  //myDB.findOne({_id:new ObjectID(id)},(err,doc)=>{
    done(null,null)
  })
//})

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
