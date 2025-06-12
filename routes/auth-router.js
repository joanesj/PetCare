const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const { forwardAuthenticated, ensureAuthenticated } = require('../middlewares/auth-middleware');

// Ruta de login
router.get('/login', forwardAuthenticated, authController.showLoginForm);

// Procesar login local
router.post('/login', forwardAuthenticated, authController.processLocalLogin);

// Ruta de login con Google
router.get('/google',authController.initiateGoogleLogin);

// Callback de Google
router.get('/google/callback', authController.handleGoogleCallback);

// Ruta de registro
router.get('/register', forwardAuthenticated, authController.showRegisterForm);

// Procesar registro
router.post('/register', forwardAuthenticated, authController.processRegistration);

// Ruta de logout
router.get('/logout', ensureAuthenticated, authController.logout);

module.exports = router;