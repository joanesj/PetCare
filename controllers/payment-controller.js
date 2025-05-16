const axios = require('axios');
require('dotenv').config();

class PaymentController {
    constructor() {
        this.createPayment = this.createPayment.bind(this);
    
    }
    
    viewPayment(req,res) {
        res.render('form-payment-services.ejs');
    }

     async createPayment(req, res) {
        try {

            const {
                cardholderName,
                cardNumber,
                expirationMonth,
                expirationYear,
                cvv,
                amount,
                currency,
                service
            } = req.body;

            const token = process.env.key_fakepayment;


            const response = await axios.post('https://fakepayment.onrender.com/payments', {
        
                        "full-name":cardholderName,
                         "card-number":cardNumber,
                         "expiration-month":expirationMonth,
                        "expiration-year":expirationYear,
                        "cvv":cvv,
                        "amount":amount,
                        "currency":currency,
                        "description":service
                    
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data);
                
            res.json({ message: 'Pago realizado', apiResponse: response.data });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al procesar el pago' });
        }
    }
  
   
  }
  
  module.exports = PaymentController;