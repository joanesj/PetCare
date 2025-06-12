const passport = require('passport');
const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
require('dotenv').config();

class AuthController {
  constructor() {
    this.showLoginForm = this.showLoginForm.bind(this);
    this.processLocalLogin = this.processLocalLogin.bind(this);
    this.initiateGoogleLogin = this.initiateGoogleLogin.bind(this);
    this.handleGoogleCallback = this.handleGoogleCallback.bind(this);
    this.showRegisterForm = this.showRegisterForm.bind(this);
    this.processRegistration = this.processRegistration.bind(this);
    this.logout = this.logout.bind(this);
  }

  showLoginForm(req, res) {
    res.render('login', { 
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      title: 'Iniciar Sesión',
      messages: req.flash() 
    });
  }

  processLocalLogin(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('error', info.message);
        return res.redirect('/auth/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // Redirigir a la página de pagos si es usuario normal
        // o al panel de admin si es administrador
        return res.redirect(user.is_admin ? '/admin/contacts' : '/');
      });
    })(req, res, next);
  }

  initiateGoogleLogin(req, res) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      callbackURL: 'http://localhost:3000/auth/google/callback',
      prompt: 'select_account'
    })(req, res);
  }

  handleGoogleCallback(req, res, next) {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('error', info.message || 'Error al autenticar con Google');
        return res.redirect('/auth/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect(user.is_admin ? '/admin/contacts' : '/');
      });
    })(req, res, next);
  }

  showRegisterForm(req, res) {
    res.render('register', { 
      title: 'Registrar Usuario',
      messages: req.flash() 
    });
  }

  async processRegistration(req, res) {
    try {
      const { username, email, password } = req.body;
      const userModel = new UserModel();
      
      // Verificar si el usuario o email ya existen
      const existingUser = await userModel.findByUsername(username);
      if (existingUser) {
        req.flash('error', 'El nombre de usuario ya está en uso');
        return res.redirect('/auth/register');
      }
      
      const existingEmail = await userModel.findByUsername(email);
      if (existingEmail) {
        req.flash('error', 'El correo electrónico ya está registrado');
        return res.redirect('/auth/register');
      }
      
      await userModel.createUser(username, email, password);
      req.flash('success', 'Usuario registrado exitosamente. Por favor inicie sesión.');
      res.redirect('/auth/login');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error al registrar usuario: ' + error.message);
      res.redirect('/auth/register');
    }
  }

  logout(req, res) {
    req.logout((err) => {
      if (err) {
        console.error(err);
        return res.redirect('/');
      }
      res.redirect('/');
    });
  }
}

module.exports = new AuthController();