const axios = require('axios');
const contactsModel = require('../models/contacts-model');

class ContactsController {
    constructor() {
        this.contactsModel = new contactsModel();
        this.createContact = this.createContact.bind(this);
        this.getContacts = this.getContacts.bind(this);
    }

    async createContact(req, res) {
        const { name, email, comment} = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const responseIp = await axios.get('https://api.ipify.org?format=json');
        const ip = responseIp.data.ip;
        try {
            const contact = await this.contactsModel.createContact(name, email, comment, ip);
            res.status(201).json(contact);
        } catch (error) {
            console.log(error);
            
            res.status(500).json({ error: error.message });
        }
    }

    async getContacts(req, res) {
        try {
            const contacts = await this.contactsModel.getAllContacts();
            res.status(200).json(contacts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ContactsController;