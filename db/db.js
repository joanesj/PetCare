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
                date TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Error creating table ' + err.message);
                }
            });
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