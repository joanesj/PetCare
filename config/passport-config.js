const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const UserModel = require('../models/user-model');
require('dotenv').config();

// Estrategia Local
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const userModel = new UserModel();
      const user = await userModel.findByUsername(username);
      
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      
      // Para usuarios de Google que no tienen contraseña
      if (!user.password_hash) {
        return done(null, false, { message: 'Por favor inicie sesión con Google' });
      }
      
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Error en autenticación local:', error);
      return done(error);
    }
  }
));

// Estrategia Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    scope: ['profile', 'email'],
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    // accessToken, refreshToken y req están disponibles por si necesitas usarlos,
    // por ejemplo, para guardar tokens en la base de datos o acceder a la sesión.
    // En este caso, solo se usan los datos del perfil de Google para autenticar/crear usuarios.
    try {
      const userModel = new UserModel();
      const email = profile.emails[0].value;
      const googleId = profile.id;
      
      // Buscar usuario por Google ID primero
      let user = await userModel.findByGoogleId(googleId);
      
      if (!user) {
        // Si no existe, buscar por email
        user = await userModel.findByUsername(email);
        
        if (!user) {
          // Crear nuevo usuario con Google
          user = await userModel.createUser(
            email, 
            email, 
            null, // No password
            googleId
          );
        } else {
          // Actualizar usuario existente con Google ID
          await new Promise((resolve, reject) => {
            userModel.db.run(
              'UPDATE users SET google_id = ? WHERE id = ?',
              [googleId, user.id],
              (err) => err ? reject(err) : resolve()
            );
          });
        }
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Error en autenticación con Google:', error);
      return done(error);
    }
  }));
}

// Serialización y deserialización
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userModel = new UserModel();
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});