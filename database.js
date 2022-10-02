const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = 'data.db';

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            surname text,
            email text UNIQUE, 
            phone INTEGER UNIQUE,
            password text, 
            CONSTRAINT email_unique UNIQUE (email),

            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                let insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
            }
        });  
    }
});

module.exports = db;