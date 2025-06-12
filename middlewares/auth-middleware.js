function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Por favor inicia sesión para acceder a esta página');
  res.redirect('/auth/login');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  req.flash('error', 'Acceso no autorizado');
  res.redirect('/');
}

function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  // Redirigir a admin si es administrador, o a payment si es usuario normal
  res.redirect(req.user.is_admin ? '/admin/contacts' : '/');
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
  forwardAuthenticated
};