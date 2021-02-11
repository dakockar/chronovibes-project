# Chronovibes Journal Project

## Description

The app allows the user to create an account, and while logged in, record their daily moods and thoughts via writing entries. Entries can be searched, edited and deleted. Entries can be set to private (only visible to author) or public (visible to any logged in user).

## User Stories

(To be added)

## Backlog

- Fetch a music playlist generated depending on the mood of the user, using external API (Spotify) 
- Allow user to save playlists to a collection

## Routes


* GET /
  * renders the index page with login/signup forms

* GET /auth/signup
  * redirects to / if user is logged in
  * else renders signup form

* POST /auth/signup
  * redirects to / if user is logged in
  * body:
    * username
    * password
    * password confirmation

* GET /auth/login
  * redirects to / if user logged in
  * render login form 

* POST /auth/login
  * redirects to / if user is logged in
  * body:
    * username
    * password

* GET /entries 
  * renders a list of all entries

* GET /entries/:id
  * show individual entry by id

* POST /entries/create
  * redirects to / if user not logged in
  * body:
    * title
    * description
    * time
    * visibility

* GET /logout
  * ends session


## Models



## Links

#### Git

[Repository](https://github.com/dakockar/chronovibes-project)

#### Slides