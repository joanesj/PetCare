
  const axios = require('axios');
const PaymentsModel = require('../models/payment-model'); // Asegúrate de que la ruta es correcta
require('dotenv').config();

class PaymentController {
    constructor() {
        this.paymentsModel = new PaymentsModel();
        this.createPayment = this.createPayment.bind(this);
        this.viewPayment = this.viewPayment.bind(this);
    }

    viewPayment(req, res) {
        res.render('form-payment-services.ejs');
    }

    async createPayment(req, res) {
        const {
            cardholderName,
            cardNumber,
            expirationMonth,
            expirationYear,
            cvv,
            amount,
            currency,
            service,
        } = req.body;

        const token = process.env.key_fakepayment;

        try {
            // Procesar el pago con la API externa
            const response = await axios.post('https://fakepayment.onrender.com/payments', {
                "full-name": cardholderName,
                "card-number": cardNumber,
                "expiration-month": expirationMonth,
                "expiration-year": expirationYear,
                "cvv": cvv,
                "amount": amount,
                "currency": currency,
                "description": service
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            
            // Si el pago es exitoso, guardamos en la base de datos
            if (response.data && response.data.success === true) {
                const paymentData = {
                    userId: req.user.id || null,
                    service,
                    amount,
                    currency,
                    status: response.data.status
                };

                const savedPayment = await this.paymentsModel.createPayment(paymentData);

                res.json({
                    message: 'Pago realizado y registrado exitosamente',
                    apiResponse: response.data,
                    payment: savedPayment
                });
            } else {
                res.status(400).json({
                    message: 'El pago no fue aprobado',
                    apiResponse: response.data
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'Error al procesar el pago',
                error: error.message
            });
        }
    }
}

module.exports = PaymentController;