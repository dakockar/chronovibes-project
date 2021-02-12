# Chronovibes Journal Project

## Description

The app allows the user to create an account, and while logged in, record their daily moods and thoughts via writing entries. Entries can be searched, edited and deleted. Entries can be set to private (only visible to author) or public (visible to any logged in user).

## User Stories

- 404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
- 500 - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- login-signup - As a user I want to see a welcome page that gives me the option to either log in as an existing user, or sign up with a new account.
- signup - As a user I want to sign up with my email and password so that I can safely log my mood and entries.
- home - As a user, after I logged in, I want to see the home page that welcomes me with a quote and a mood-query, so that I can enter my mood. Once the mood is selected, only the selected mood will be shown on the home page. User can select the mood once a day. 
- navbar - As a user, I want to have a navbar that can be accessed after I logged in, that provides a searchbar where I can search for entries using keywords, and quick access to all my protected pages.
- profile - As a user I want to have a profile page where I can see my username and time/date of my signup, and upload my photo.
- write - As a user, I want to write a new entry, select whether it is public or private, and submit it.
- entries - As a user, I want to see a list of my own public and private entries, and when I click on them I want to be redirected to the specific entry (entries/entryId page).
- entries/entryId - As a user, I want to see the entry with the given id, and have options to edit or delete it.
- entry-search-results - As a user I want to see the search results: the title and the preview of the entries (preview will include the search keyword and the words near it).



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
  * otherwise redirects to /entries
  * body:
    * title
    * description
    * time
    * visibility

* GET /logout
  * ends session

<!-- edit, delete, search routes to be added -->


## Models



## Links

#### Git

[Repository](https://github.com/dakockar/chronovibes-project)

#### Slides