const ContactsModel = require('../models/contacts-model');
const PaymentsModel = require('../models/payment-model');

class AdminController {
  constructor() {
    this.contactsModel = new ContactsModel();
    this.paymentsModel = new PaymentsModel();

    this.viewContacts = this.viewContacts.bind(this);
    this.viewPayments = this.viewPayments.bind(this);
  }
  
  viewContacts(req, res) {
    this.contactsModel.getAllContacts()
      .then(contacts => {  
        console.log(contacts);      
        res.render('admin', { 
          title: 'Contactos',
          contacts,
          user: req.user
        });
      })
      .catch(err => {
        console.error(err);
        req.flash('error', 'Error al recuperar contactos');
        res.redirect('/');
      });
  }

  viewPayments(req, res) {
    this.paymentsModel.getAllPayments()
      .then(payments => {
        console.log(payments);
        res.render('payments', {
          title: 'Pagos',
          payments,
          user: req.user
        });
      })
      .catch(err => {
        console.error(err);
        req.flash('error', 'Error al recuperar pagos');
        res.redirect('/');
      });
  }
}

module.exports = AdminController;