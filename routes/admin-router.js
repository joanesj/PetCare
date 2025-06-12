const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin-controller');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth-middleware');
const adminController = new AdminController();

router.get('/contacts', ensureAuthenticated, ensureAdmin, adminController.viewContacts);
router.get('/payments', ensureAuthenticated, ensureAdmin, adminController.viewPayments);

module.exports = router;