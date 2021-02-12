// ℹ️ Gets access to environment variables/settings
require("dotenv/config");

const mongoURI = process.env.MONGO_URI;


// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
const express = require("express");

// Handles the handlebars
const hbs = require("hbs");
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "chronovibes-project";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with IronGenerator`;

const mongoose = require("mongoose");
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


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
