const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth-middleware');
const PaymentController = require('../controllers/payment-controller');
const paymentController = new PaymentController();

router.get('/', ensureAuthenticated, paymentController.viewPayment);
router.post('/add', paymentController.createPayment);

module.exports = router;