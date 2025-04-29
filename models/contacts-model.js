const db = require('../db/db.js'); // Importa la función para inicializar la base de datos

class ContactsModel {
    constructor() {
        this.db = db(); // Inicializa la base de datos llamando a la función
    }

    createContact(name, email, comment, ip) {
        const date = new Date().toISOString();
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO contacts (name, email, comment, ip, date) VALUES (?, ?, ?, ?, ?)`;
            this.db.run(query, [name, email, comment, ip, date], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ id: this.lastID, name, email, comment, ip, date });
            });
        });
    }

    getAllContacts() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM contacts`;
            this.db.all(query, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
}

module.exports = ContactsModel;