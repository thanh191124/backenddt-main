const db = require('../config/db'); // Import kết nối đến MySQL từ db.js

const VoucherModel = {
  // Lấy tất cả vouchers
  getAllVouchers: (callback) => {
    const query = 'SELECT * FROM voucher';
    db.query(query, (err, results) => {
      if (err) throw err;
      callback(null, results);
    });
  },

  // Lấy voucher theo ID
  getVoucherById: (VoucherID, callback) => {
    const query = 'SELECT * FROM voucher WHERE VoucherID = ?';
    db.query(query, [VoucherID], (err, results) => {
      if (err) throw err;
      callback(null, results[0]);
    });
  },

  // Thêm voucher mới
  createVoucher: (newVoucher, callback) => {
    const query = 'INSERT INTO voucher (Code, ExpiryDate, MinimumPurchaseAmount, status, percent) VALUES ( ?, ?, ?, ?, ?)';
    db.query(
      query,
      [
        newVoucher.Code, 
        newVoucher.ExpiryDate, 
        newVoucher.MinimumPurchaseAmount, 
        newVoucher.status,
        newVoucher.percent
      ],
      (err, result) => {
        if (err) throw err;
        callback(null, result.insertId);
      }
    );
  },

  // Cập nhật voucher theo ID
  updateVoucher: (VoucherID, updatedVoucher, callback) => {
    const query = 'UPDATE voucher SET Code = ?, ExpiryDate = ?, MinimumPurchaseAmount = ?, usablequantity = ?, status = ?, percent = ? WHERE VoucherID = ?';
    db.query(
      query,
      [
        updatedVoucher.Code, 
        updatedVoucher.ExpiryDate, 
        updatedVoucher.MinimumPurchaseAmount, 
        updatedVoucher.usablequantity,
        updatedVoucher.status,
        updatedVoucher.percent,
        VoucherID
      ],
      (err, result) => {
        if (err) throw err;
        callback(null, result);
      }
    );
  },

  // Xóa voucher theo ID
  deleteVoucher: (VoucherID, callback) => {
    const query = 'DELETE FROM voucher WHERE VoucherID = ?';
    db.query(query, [VoucherID], (err, result) => {
      if (err) throw err;
      callback(null, result);
    });
  },

  // Tìm voucher theo mã code
  getVoucherByCode: (code, result) => {
    const query = 'SELECT * FROM voucher WHERE Code = ?';  // Đảm bảo bảng của bạn tên là "voucher" (hoặc đúng tên bảng trong database)

    db.query(query, [code], (err, res) => {
      if (err) {
        return result(err, null);
      }
      if (res.length > 0) {
        return result(null, res[0]);  // Trả về voucher đầu tiên tìm được
      }
      result(null, null);  // Không tìm thấy voucher
    });
  },
  incrementQuantityUsed: (VoucherID, callback) => {
    const query = 'UPDATE voucher SET quantityused = quantityused + 1 WHERE VoucherID = ?';
    db.query(query, [VoucherID], (err, result) => {
      if (err) throw err;
      callback(null, result);
    });
  }
  
};

module.exports = VoucherModel;
