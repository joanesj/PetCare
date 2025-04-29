class PaymentController {
    constructor() {

    }
    
    viewPayment(req,res) {
        res.render('form-payment-services.ejs');
    }
  
   
  }
  
  module.exports = PaymentController;