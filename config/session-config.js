module.exports = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  },
  name: 'petcare.sid', // Nombre personalizado para la cookie
};