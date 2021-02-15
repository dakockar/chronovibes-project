const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model.js')
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  // redirectUri: 'http://www.example.com/callback'
});
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));



// custom middlewares

const validateInput = (req, res, next) => {
  let username = req.body.username
  let password = req.body.password
  if (!username || !password) {
    res.render('index', { msg: 'Please fill in all fields' })
  }
  else {
    next()
  }
}

const checkAuth = (req, res, next) => {
  if (req.session.loggedInUser) {
    next()
  }
  else {
    res.redirect('/')
  }
}


// GET routes

router.get('/signup', (req, res) => {
  res.render('index')
})


router.get('/login', (req, res) => {
  res.render('index')
})


router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get("/profile", (req, res) => {
  let user = req.session.loggedInUser;
  let signupDate = req.session.loggedInUser.signedUp;
  res.render("user/profile.hbs", { user, signupDate });
})

router.get("/home", checkAuth, (req, res, next) => {
  let user = req.session.loggedInUser;

  User.findOne({ username: user.username })
    .then((user) => {

      setTimeout(() => {
        if (user.isMoodChosen) {
          spotifyApi.searchPlaylists(user.mood)
            .then((data) => {
              let playlists = data.body.playlists.items;
              res.render("user/home-mood-chosen.hbs", { user, playlists });
            })
            .catch((err) => {
              console.log(err);
            });
        }
        else {
          res.render("user/home.hbs", { user });
        }
      }, 600)

    })
    .catch((err) => {
      console.log("there was a problem finding the user", err);
    });
})


// POST routes

router.post('/signup', validateInput, (req, res) => {

  const { username, password, confirmPassword } = req.body
  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(password, salt)
  //at least 5 chars, needs to include a numerical and alphabetic character
  let regexPw = /(?=.*\d)(?=.*[a-z]).{5,}/
  if (!regexPw.test(password)) {
    res.render('index', { msg: 'password too weak' })
    return
  }

  if (password !== confirmPassword) {
    res.render('index', { msg: 'passwords do not match' })
    return
  }

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render('index', { msg: 'Username already exists' })
      }
      else {
        User.create({ username, password: hash })
          .then(() => {
            res.render("index.hbs", { msg: "signup was successful. please login" })
          })
          .catch(err => next(err))
      }
    })
    .catch(err => console.log(err))

})


router.post('/login', validateInput, (req, res, next) => {

  const { username, password } = req.body
  User.findOne({ username: username })
    .then(result => {
      if (result) {
        // username exists
        bcrypt.compare(password, result.password)
          .then(isMatch => {
            if (isMatch) {
              req.session.loggedInUser = result
              res.redirect('/home')
            }
            else {
              res.render('index', { msg: 'incorrect password' })
            }
          })
      }
      else {
        // username doesn't exist
        res.render('index', { msg: 'Username not found' })
      }
    })
    .catch(err => console.log('error', err))
})



router.post("/mood", (req, res, next) => {
  const { mood } = req.body;
  const loggedInUser = req.session.loggedInUser;

  User.findOneAndUpdate({ username: loggedInUser.username }, { mood: mood, isMoodChosen: true })
    .then((user) => {
      console.log("user is updated");

      // isMoodChosen is automatically set to false after 10 secs (for testing)
      // TODO: in the final product, we'll set it to false at the end of the day
      setTimeout(() => {
        User.findOneAndUpdate({ username: user.username }, { isMoodChosen: false })
          .then(() => {
            console.log("isMoodChosen set to false");
          })
          .catch((err) => {
            console.log("user update failed: ", err);
          });
      }, 10000);

      res.redirect("/home");
    })
    .catch(err => console.log("finding failed: ", err));
})


router.post('/change-password', (req, res) => {
  let username = req.session.loggedInUser.username
  const { newPwd, newPwd2, currPwd } = req.body

  if (newPwd !== newPwd2) {
    res.render('profile', { msg: 'passwords do not match, please try again' })
    return
  }

  User.findOne({ username: username })
  .then(result => {
      bcrypt.compare(currPwd, result.password)
      .then(isMatch => {
      if (isMatch) {
      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(newPwd, salt)

      User.findOneAndUpdate({ username: req.session.loggedInUser.username,  password: hash })
      .then(() => {
        res.render('user/profile', { msg: 'Your password was successfully updated!' })
      })
      .catch(err => console.log(err))
    }
    else {
      res.render('user/profile', { msg: 'Please enter your current password correctly' })
    }
    })
    .catch(err => console.log(err))
  })
})



router.post('/delete-user', (req, res) => {
  let id = req.session.loggedInUser._id

  User.findByIdAndDelete(id)
  .then(() => {
    res.render('index', {msg: 'Your account has been deleted'})
  })
  .catch(err => console.log(err))
})


module.exports = router, validateInput, checkAuth
