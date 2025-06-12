// This file initializes the SQLite3 database connection and sets up the schema for the contacts.

const sqlite3 = require('sqlite3').verbose();
class Database {
    constructor() {
        this.db = new sqlite3.Database('./db/contacts.db', (err) => {
            if (err) {
                console.error('Error opening database ' + err.message);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });
        this.initializeSchema();
    }

    initializeSchema() {
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                comment TEXT,
                ip TEXT,
                date TEXT NOT NULL,
                pais TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Error creating contacts table ' + err.message);
                }
            });

            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password_hash TEXT,
                is_admin BOOLEAN DEFAULT 0,
                google_id TEXT UNIQUE,
                email TEXT UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error creating users table ' + err.message);
                }
            });
        });

        this.db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    service TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)`, (err) => {
    if (err) {
        console.error('Error creating payments table ' + err.message);
    }
});
    }

    getDatabase() {
        return this.db;
    }
}

const initializeDatabase = () => {
    const database = new Database();
    return database.getDatabase();
};

module.exports = initializeDatabase;