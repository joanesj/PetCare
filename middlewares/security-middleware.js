function securityMiddleware(req, res, next) {
  // Configuración de cabeceras de seguridad
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP Configuration actualizada
 
  // In your security-middleware.js
res.setHeader(
  'Content-Security-Policy',
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://accounts.google.com; " +
  "style-src 'self' 'unsafe-inline' https://www.google.com https://fonts.googleapis.com https://accounts.google.com; " +
  "img-src 'self' data: https://www.google.com https://*.googleusercontent.com https://developers.google.com; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "connect-src 'self' https://www.google.com; " +
  "frame-src 'self' https://www.google.com https://accounts.google.com;"
);
  next();
}

module.exports = securityMiddleware;