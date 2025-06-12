const db = require('../db/db');
const bcrypt = require('bcrypt');

class UserModel {
  constructor() {
    this.db = db();
  }

  async createUser(username, email, password, googleId = null) {
    const password_hash = password ? await bcrypt.hash(password, 10) : null;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (username, password_hash, is_admin, email, google_id) VALUES (?, ?, ?, ?, ?)`;
      
      this.db.get(`SELECT COUNT(*) as count FROM users`, [], async (err, row) => {
        if (err) return reject(err);
        
        const isAdmin = row.count === 0;
        this.db.run(query, [username, password_hash, isAdmin ? 1 : 0, email, googleId], function(err) {
          if (err) return reject(err);
          resolve({ 
            id: this.lastID, 
            username,
            email,
            is_admin: isAdmin,
            google_id: googleId
          });
        });
      });
    });
  }

  findByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  findByGoogleId(googleId) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM users WHERE google_id = ?`, [googleId], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
}

module.exports = UserModel;