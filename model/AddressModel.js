const db = require('../config/db'); // Kết nối đến MySQL từ db.js

const addressModel = {
    // Lấy tất cả địa chỉ của người dùng
    getAllAddresses: (callback) => {
        const query = 'SELECT * FROM Address';
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // Lấy địa chỉ của một người dùng theo UserID
    getAddressesByUserId: (userId, callback) => {
        const query = 'SELECT * FROM Address WHERE UserID = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // Thêm địa chỉ mới cho người dùng
    addAddress: (address, userId, addressType, phone, name, callback) => {
        const query = 'INSERT INTO Address (address, UserID, addressType, phone, name) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [address, userId, addressType, phone, name], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // Cập nhật địa chỉ của người dùng
    updateAddress: (id_address, address, addressType, phone, name, callback) => {
        const query = 'UPDATE Address SET address = ?, addressType = ?, phone = ?, name = ? WHERE id_address = ?';
        db.query(query, [address, addressType, phone, name, id_address], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
// Lấy địa chỉ của một người dùng theo UserID
getAddressesByUserId: (UserID, callback) => {
    const query = 'SELECT * FROM address WHERE UserID  = ?';
    db.query(query, [UserID], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
},

    // Xóa địa chỉ theo id
    deleteAddress: (id_address, callback) => {
        const query = 'DELETE FROM Address WHERE id_address = ?';
        db.query(query, [id_address], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    // Lấy địa chỉ theo ID
getAddressById: (idAddress, callback) => {
    const query = 'SELECT * FROM Address WHERE id_address = ?';
    db.query(query, [idAddress], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

};

module.exports = addressModel;
