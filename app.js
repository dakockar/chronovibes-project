// ℹ️ Gets access to environment variables/settings
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
const express = require("express");
const mongoose = require('mongoose')

// Handles the handlebars
const hbs = require("hbs");
const app = express();

// Register handlebar partials
hbs.registerPartials(__dirname + "/views/partials");

// Dateformat helpers
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

// custom helpers

hbs.registerHelper('splitBefore', (str, word) => {
  return str.split(word)[0];
});

hbs.registerHelper('splitAfter', (str, word) => {
  // let i = str.toLowerCase().indexOf(word.toLowerCase());

  let i = str.indexOf(word);
  return str.substring(i + word.length);
});

// hbs.registerHelper('highlight', (str, word) => {
//   let arr = str.split(word);

//   let output = arr.join(`<span class='highlighted'> ${word} </span>`);
//   return output;
// })


var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "chronovibes-project";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

app.use(session({
  secret: 'someSecretWord',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24 // 1 day
  })
}))



// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const auth = require('./routes/auth.routes')
app.use('/', auth)

const entry = require('./routes/entry.routes')
app.use('/', entry)


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
