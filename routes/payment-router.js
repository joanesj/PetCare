var express = require('express');
const PaymentController = require('../controllers/payment-controller');
const router = express.Router();

const paymentController = new PaymentController();

router.get('/', paymentController.viewPayment);
router.post('/add', paymentController.createPayment);

module.exports = router;