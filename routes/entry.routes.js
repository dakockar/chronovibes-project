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

// show newest entries first
const sortByDate = (arr) => {
  arr.sort((a, b) => {
    if (a.time < b.time) return 1
    else if (a.time > b.time) return -1
    else return 0
  })
}

function getPreview(index, str) {
  if (index < 50) {
    if (str.length < 200) return str;
    else return str.substring(0, 200) + "...";
  }
  else {
    if (str.length < 200) return str;
    else {
      return "..." + str.substring(index - 50, index + 150) + "...";
    }
  }
}


// GET

router.get('/write', checkAuth, (req, res) => {
  let user = req.session.loggedInUser;
  res.render('user/write', { user })
});


router.get('/entries', checkAuth, (req, res) => {
  let user = req.session.loggedInUser

  Entry.find({ authorId: user._id })
    .populate('authorId', 'username')
    .then(entries => {
      sortByDate(entries)
      // show a preview of entries only 
      for (let entry of entries) {
        entry.entryBody = getPreview(0, entry.entryBody);
      }
      res.render('user/entries', { user, entries, tags: entries.tags })
    })
    .catch(err => console.log(err))
});



router.get('/entries/:yyyy/:mm/:dd', checkAuth, (req, res) => {
  let user = req.session.loggedInUser
  let dd = req.params.dd
  let mm = req.params.mm
  let yyyy = req.params.yyyy

  let query = {
    $gte: new Date(yyyy, mm - 1, dd, 0, 0, 0),
    $lte: new Date(yyyy, mm - 1, dd, 23, 59, 59)
  }

  Entry.find({ time: query, authorId: user._id })
    .populate('authorId', 'username')
    .then(results => {
      sortByDate(results)
      res.render('user/entries-by-date', { results, user, query: `${dd}/${mm}/${yyyy}` })
    })
    .catch(err => { console.log(err) })
})



router.get('/entries/:id', checkAuth, (req, res) => {
  let id = req.params.id
  let user = req.session.loggedInUser;
  // find entry by given entry ID
  Entry.findById(id)
    .then(entry => {
      // find the entry's author
      User.findById(entry.authorId)
        .then(result => {
          // check if author and user ID's match, then display edit btn accordingly
          if (entry.authorId == user._id) {
            res.render('user/entrydetails', { entry, user, tags: entry.tags, author: result.username, isAuth: true })
          }
          else {
            res.render('user/entrydetails', { entry, user, tags: entry.tags, author: result.username })
          }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
});


router.get('/entries/edit/:id', checkAuth, (req, res, next) => {
  let id = req.params.id
  let user = req.session.loggedInUser;
  Entry.findById(id)
    .then(entry => {
      res.render('user/edit-form', { entry, user })
    })
    .catch(err => console.log(err))
})


router.get('/entries/search/:tag', checkAuth, (req, res) => {
  let queryStr = req.params.tag
  let user = req.session.loggedInUser;

  Entry.find({
    // authorId: user._id,
    tags: new RegExp(queryStr, 'i')
  })
    .populate('authorId', 'username')
    .then(results => {
      // shows my entries + all public entries

      for (let entry of results) {
        entry.entryBody = getPreview(0, entry.entryBody);
      }

      sortByDate(results);
      res.render('user/tag-results', { queryStr, results, user, author: results.authorId })
    })
    .catch(err => console.log(err))
})


router.get('/author/search/:author', checkAuth, (req, res) => {
  let queryStr = req.params.author
  let user = req.session.loggedInUser;

  User.findOne({ username: queryStr })
    .then(author => {
      Entry.find({ authorId: author._id, $or: [{ isPublic: true }, { authorId: user._id }] })
        .populate('authorId', 'username')
        .then(results => {
          for (let entry of results) {
            entry.entryBody = getPreview(0, entry.entryBody);
          }

          sortByDate(results);
          res.render('user/tag-results', { queryStr, results, user, author: results.authorId })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

})
// POST

router.post('/create', checkAuth, (req, res) => {
  let user = req.session.loggedInUser;
  const { title, entryBody, tags, public } = req.body;
  let isPublic = false;

  if (public === "on") isPublic = true;

  let tagsArr = tags.length > 0 ? tags.split(', ') : []
  let newEntry = {
    title,
    entryBody,
    tags: tagsArr,
    authorId: user._id,
    isPublic
  };

  Entry.create(newEntry)
    .then(() => {
      res.redirect('/entries')
    })
    .catch(err => {
      console.log(err)
      res.render('/user/write', { user, msg: 'Something went wrong, please try again' })
    })

});


router.post('/entries/edit/:id', checkAuth, (req, res, next) => {

  let id = req.params.id
  const { title, entryBody, tags } = req.body;
  let tagsArr = tags.length > 0 ? tags.split(', ') : []
  let editedEntry = {
    title: title,
    entryBody: entryBody,
    tags: tagsArr
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
  let queryStr = req.body.search;
  let user = req.session.loggedInUser;
  let { entryType } = req.body;

  // empty check for search
  if (!queryStr) {
    res.render('user/results.hbs', { user, msg: 'Please enter a search keyword' });
    return;
  }

  Entry.find(
    {
      $or: [{ entryBody: new RegExp(queryStr, 'i') }, { title: new RegExp(queryStr, 'i') }]
    })
    .populate('authorId', 'username')
    .then(results => {
      // filtering by entryType (my or all)
      if (entryType === "my") {
        results = results.filter(entry => entry.authorId.toString() === user._id.toString());
      }

      for (let entry of results) {
        let index = entry.entryBody.indexOf(queryStr);
        entry.entryBody = getPreview(index, entry.entryBody);
        console.log(entry)
      }
      sortByDate(results)
      res.render('user/results', { results, user, queryStr })
    })
    .catch(err => console.log(err))
})


module.exports = router;

