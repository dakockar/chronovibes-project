const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model.js')



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


// POST routes

router.post('/signup', validateInput, (req, res) => {

  const { username, password, confirmPassword } = req.body
  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(password, salt)

  let regexPw = /(?=.*[0-9])/
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
            res.render('index', { msg: 'congrats, you have signed up' })
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



router.get("/home", (req, res, next) => {
  res.render("user/home.hbs");
})



module.exports = router
