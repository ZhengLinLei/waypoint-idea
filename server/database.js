const sqlite3 = require('sqlite3').verbose();

// GET DBKEYS
const { database } = require('./dbkeys');

// CONNECT TO DB

let db = new sqlite3.Database(database.URI, (err) => {
    if (err) {
      console.error(err.message);
    }
});

module.exports = db;