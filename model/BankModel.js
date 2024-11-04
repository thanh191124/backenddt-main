const db = require('../config/db'); // Kết nối đến MySQL từ db.js

const bankAccountModel = {
    // Lấy tất cả tài khoản ngân hàng
    getAllAccounts: (callback) => {
        const query = 'SELECT * FROM bank_accounts';
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // Lấy tài khoản ngân hàng theo ID
    getAccountById: (id, callback) => {
        const query = 'SELECT * FROM bank_accounts WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // Thêm tài khoản ngân hàng mới
    addAccount: (accountNumber, bankName, accountHolder, transactionDescription, imageUrl, callback) => {
        const createdAt = new Date();
        const query = 'INSERT INTO bank_accounts (account_number, bank_name, account_holder, transaction_description, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [accountNumber, bankName, accountHolder, transactionDescription, imageUrl, createdAt], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // Cập nhật thông tin tài khoản ngân hàng
    updateAccount: (id, accountNumber, bankName, accountHolder, transactionDescription, imageUrl, callback) => {
        const query = 'UPDATE bank_accounts SET account_number = ?, bank_name = ?, account_holder = ?, transaction_description = ?, image_url = ? WHERE id = ?';
        db.query(query, [accountNumber, bankName, accountHolder, transactionDescription, imageUrl, id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // Xóa tài khoản ngân hàng theo ID
    deleteAccount: (id, callback) => {
        const query = 'DELETE FROM bank_accounts WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }
};

module.exports = bankAccountModel;
