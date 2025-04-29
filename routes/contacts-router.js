var express = require('express');
const ContactController = require('../controllers/contacts-controller')

const router = express.Router();
const contactController = new ContactController();
router.post('/add', contactController.createContact);


module.exports = router;