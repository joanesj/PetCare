const axios = require('axios');
const contactsModel = require('../models/contacts-model');
const nodemailer = require ('nodemailer');
require('dotenv').config()

class ContactsController {
    constructor() {
        this.contactsModel = new contactsModel();
        this.createContact = this.createContact.bind(this);
        this.getContacts = this.getContacts.bind(this);
        this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.email_g,
        pass: process.env.pass_g
      }
    });
    }

    async createContact(req, res) {
        const { name, email, comment, token} = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        if (!token) {
      return res.status(400).send("Debe completar el reCAPTCHA");
    }

    try {
      const fecha = new Date().toISOString();
      const responseIp = await axios.get('https://api.ipify.org?format=json');
      const ip = responseIp.data.ip;
      const responsePais = await axios.get(`https://api.ipapi.com/api/${ip}?access_key=${process.env.Access_key}`);
      const pais = responsePais.data.country_name;

      const recaptchaSecretKey = process.env.key_Capchat;
      const recaptchaVerificationResponse = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: recaptchaSecretKey,
            response: token,
            remoteip: ip,
          },
        }
      );
     
      if (recaptchaVerificationResponse.data.success) {
        const mailOptions = {
          from: process.env.email_g,
          to: [email, process.env.email2_d], // Agrega más destinatarios si es necesario
          subject: 'Nuevo comentario',
          text: 'Nombre: '+name+'\nEmail: '+email+'\nMensaje: '+comment+ '\nIp: '+ip+'\nPais de origen: '+ pais+'\nFecha: '+fecha
        };
        this.transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Correo enviado: ${info.response}`);
          }
        });
        await this.contactsModel.createContact(name, email, comment, ip,pais);
        return res.status(200).send("Enviado con éxito");
      } else {
        console.error('Recaptcha verification failed:', recaptchaVerificationResponse.data['error-codes']);
        return res.status(400).send("Error en la verificación del reCAPTCHA");
      }
    } catch (error) {
      console.error('Error processing contact form:', error);
      return res.status(500).send("Error interno del servidor");
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