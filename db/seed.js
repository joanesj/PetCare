const db = require('./db');

async function seedDatabase() {
  try {
    const database = db();
    
    // Insertar usuario admin si no existe
    await new Promise((resolve, reject) => {
      database.get("SELECT COUNT(*) as count FROM users WHERE username = 'admin@petcare.com'", [], async (err, row) => {
        if (err) return reject(err);
        
        if (row.count === 0) {
          const bcrypt = require('bcrypt');
          const password_hash = await bcrypt.hash('admin123', 10);
          
          database.run(
            "INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)",
            ['admin@petcare.com', password_hash, 1],
            (err) => {
              if (err) return reject(err);
              console.log('Usuario admin creado');
              resolve();
            }
          );
        } else {
          console.log('Usuario admin ya existe');
          resolve();
        }
      });
    });
    
    console.log('Base de datos sembrada exitosamente');
  } catch (error) {
    console.error('Error sembrando la base de datos:', error);
  }
}

seedDatabase();