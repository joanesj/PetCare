// models/payments-model.js
const db = require('../db/db');

class PaymentsModel {
  constructor() {
    this.db = db();
  }


  async createPayment(paymentData) {
    const {
      userId,
      service,
      amount,
      currency,
      status = 'pending'
    } = paymentData;

    return new Promise((resolve, reject) => {
      const query = `INSERT INTO payments (
        user_id, 
        service, 
        amount, 
        currency, 
        status
      ) VALUES (?, ?, ?, ?, ?)`;

      this.db.run(query, [
        userId,
        service,
        amount,
        currency,
        status
      ], function(err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          userId,
          service,
          amount,
          currency,
          status
        });
      });
    });
  }

  async getAllPayments() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM payments`;

      this.db.all(query, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async getPaymentsByDateRange(startDate, endDate) {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
        id,
        service,
        amount,
        currency,
        card_last_four as cardLastFour,
        status,
        transaction_id as transactionId,
        user_email as userEmail,
        created_at as createdAt
      FROM payments 
      WHERE date(created_at) BETWEEN date(?) AND date(?)
      ORDER BY created_at DESC`;

      this.db.all(query, [startDate, endDate], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async getPaymentsByStatus(status) {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
        id,
        service,
        amount,
        currency,
        card_last_four as cardLastFour,
        status,
        transaction_id as transactionId,
        user_email as userEmail,
        created_at as createdAt
      FROM payments 
      WHERE status = ?
      ORDER BY created_at DESC`;

      this.db.all(query, [status], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async getPaymentsByService(service) {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
        id,
        service,
        amount,
        currency,
        card_last_four as cardLastFour,
        status,
        transaction_id as transactionId,
        user_email as userEmail,
        created_at as createdAt
      FROM payments 
      WHERE service = ?
      ORDER BY created_at DESC`;

      this.db.all(query, [service], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = PaymentsModel;