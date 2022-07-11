'use strict';
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const PORT = process.env.PORT || 3000;
const router = require("./routes");
const auth = require("./auth");


const app = express();

fccTesting(app); //For FCC testing purposes
app.set('view engine', 'pug')
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());

myDB(async (client) => {

  const myDataBase = await client.db('database').collection('users');

  router(app, myDataBase)

  auth(app, myDataBase)

}).catch((e) => {
  app.route('/').get((req, res) => {
    res.render('pug', {
      title: e,
      message: "Unable login"
    })
  })
})

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});