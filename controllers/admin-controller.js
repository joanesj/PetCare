const contactsModel = require('../models/contacts-model.js');

class AdminController {
  constructor() {
    this.contactsModel = new contactsModel();
    this.viewAdmin = this.viewAdmin.bind(this);
  }
  
  viewAdmin(req,res) {
    this.contactsModel.getAllContacts()
      .then(contacts => {        
        res.render('admin', { contacts });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving contacts');
      });
  }

 
}

module.exports = AdminController;