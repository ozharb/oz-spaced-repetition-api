# Spaced repetition API!

Language learning app that uses the spaced repetition learning technique to help you memorize a foreign language. The app displays 10 words in French, and asks you to recall the corresponding word in English.

This is the backend for `Spaced Repetition App`.  A live version of the app can be found at [https://spaced-repetition-ozharb.vercel.app/]

#### Authentication
Requires bearer token. You may use the front end client to login and create a token using demo account.

https://spaced-repetition-ozharb.vercel.app/login

* user name: Demo
* password: Demo@2021

#### CRUD requests
API supports Get, Post, Delete, and Patch requests.

#### Endpoints
* `/language ` get all words for user
* `/language/guess ` post user guess to first word in list
* `/user` post a new user with credentials
* `/auth` authenticat user's username and password


#### Back End

* Node and Express
  * Authentication via JWT
  * RESTful Api
* Testing
  * Supertest (integration)
  * Mocha and Chai (unit)
* Database
  * Postgres
  * Knex.js - SQL wrapper

#### Production

Deployed via Heroku


## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DATABASE_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
