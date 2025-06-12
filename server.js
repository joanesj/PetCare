require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const helmet = require('helmet');

// Configuraciones
const sessionConfig = require('./config/session-config');
require('./config/passport-config');

// Routers
const indexRouter = require('./routes/index-router');
const contactsRouter = require('./routes/contacts-router');
const adminRouter = require('./routes/admin-router');
const paymentRouter = require('./routes/payment-router');
const authRouter = require('./routes/auth-router');

// Middlewares
const securityMiddleware = require('./middlewares/security-middleware');
require('./db/seed'); // Sembrar la base de datos
// Inicialización
const app = express();


// Configuración de la aplicación
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(helmet());
app.use(securityMiddleware);

// Variables globales
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.messages = req.flash();
  res.locals.currentUrl = req.path;
  next();
});

// Rutas
app.use('/', indexRouter);
app.use('/contact', contactsRouter);
app.use('/auth', authRouter);
app.use('/payment', paymentRouter);
app.use('/admin', adminRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error', 
    message: 'Algo salió mal!' 
  });
});

// Iniciar servidor

  app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
  });
