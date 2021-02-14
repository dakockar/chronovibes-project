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
  res.render('user/write')
});


router.get('/entries', checkAuth, (req, res) => {

  Entry.find({ authorId: req.session.loggedInUser._id })
    .populate('authorId', 'username')
    .then(entries => {
      res.render('user/entries', { entries })
    })
    .catch(err =>
      console.log(err))
});


router.get('/entries/:id', checkAuth, (req, res) => {
  let id = req.params.id
  Entry.findById(id)
    .then(entry => {
      res.render('user/entrydetails', { entry })
    })
    .catch(err => console.log(err))
});


router.get('/entries/edit/:id', checkAuth, (req, res, next) => {
  let id = req.params.id
  Entry.findById(id)
    .then(entry => {
      res.render('user/edit-form', { entry })
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
    .then(() => {
      res.redirect('/entries')
    })
    .catch(err => {
      console.log(err)
      res.render('/user/write', { msg: 'Something went wrong, please try again' })
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



module.exports = router;