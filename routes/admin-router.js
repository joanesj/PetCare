var express = require('express');
const AdminController = require('../controllers/admin-controller');
const router = express.Router();

const adminController = new AdminController();

router.get('/contacts', adminController.viewAdmin)


module.exports = router;