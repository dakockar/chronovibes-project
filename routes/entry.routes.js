const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { Router } = require('express');
const Entry = require('../models/Entry.model.js');
const User = require('../models/User.model.js');
// const checkAuth = require('./auth.routes.js')

// TODO : check why importing checkAuth doesn't work
const checkAuth = (req, res, next) => {
  if (req.session.loggedInUser) {
    next()
  }
  else {
    res.redirect('/')
  }
}


// GET

router.get('/write', checkAuth, (req, res) => {
  let username = req.session.loggedInUser.username
  res.render('user/write', { username })
});


router.get('/entries', checkAuth, (req, res) => {
  let username = req.session.loggedInUser.username
  Entry.find({ authorId: req.session.loggedInUser._id })
    .populate('authorId', 'username')
    .then(entries => {
      entries.sort((a, b) => {     // show newest entries first
        if (a.time < b.time) return 1
        else if (a.time > b.time) return -1
        else return 0
      })
      res.render('user/entries', { username, entries })
    })
    .catch(err =>
      console.log(err))
});

//TODO this works but throws an AssertionError in the console if you pass in variables and not a hardcoded date 

router.get('/entries/:yyyy/:mm/:dd', checkAuth, (req, res) => {
  let username = req.session.loggedInUser.username
  let dd = req.params.dd
  let mm = req.params.mm
  let yyyy = req.params.yyyy
  let query = `${yyyy}-${mm}-${dd}`

  Entry.find({ time: { $gte: query }, authorId: req.session.loggedInUser._id })
    .then(entries => {
      entries.sort((a, b) => {
        if (a.time < b.time) return 1
        else if (a.time > b.time) return -1
        else return 0
      })
      res.render('user/entries', { entries, username })
    })
    .catch(err => { console.log(err) })
})

router.get('/entries/:id', checkAuth, (req, res) => {
  let id = req.params.id
  let username = req.session.loggedInUser.username
  Entry.findById(id)
    .then(entry => {
      res.render('user/entrydetails', { entry, username })
    })
    .catch(err => console.log(err))
});


router.get('/entries/edit/:id', checkAuth, (req, res, next) => {
  let id = req.params.id
  let username = req.session.loggedInUser.username
  Entry.findById(id)
    .then(entry => {
      res.render('user/edit-form', { entry, username })
    })
    .catch(err => console.log(err))
})


// POST

router.post('/create', checkAuth, (req, res) => {

  const { title, entryBody, tags } = req.body;
  let newEntry = {
    title: title,
    entryBody: entryBody,
    tags: tags,
    authorId: req.session.loggedInUser._id
  };

  Entry.create(newEntry)
    .then((item) => {
      res.redirect('/entries')
    })
    .catch(err => {
      console.log(err)
      res.render('/user/write', { username, msg: 'Something went wrong, please try again' })
    })

});


router.post('/entries/edit/:id', checkAuth, (req, res, next) => {

  let id = req.params.id
  const { title, entryBody, tags } = req.body;
  let editedEntry = {
    title: title,
    entryBody: entryBody,
    tags: tags
  };

  Entry.findByIdAndUpdate(id, editedEntry)
    .then(() => {
      res.redirect('/entries')
    })
});


router.post('/entries/delete/:id', checkAuth, (req, res, next) => {
  let id = req.params.id

  Entry.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/entries')
    })
    .catch(err => {
      console.log(err)
    })
});


router.post('/search', checkAuth, (req, res) => {
  let username = req.session.loggedInUser.username
  let queryStr = req.body.search
  Entry.find(
    {
      authorId: req.session.loggedInUser._id,
      $or: [{ entryBody: new RegExp(req.body.search, 'i') }, { title: new RegExp(req.body.search, 'i') }]
    })
    .then(results => {
      console.log(results)
      res.render('user/results', { results, username, queryStr })
    })
    .catch(err => console.log(err))

})


module.exports = router;

