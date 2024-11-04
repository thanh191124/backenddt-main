const { status } = require('express/lib/response');
const VoucherModel = require('../model/VouchersModel');

// Lấy tất cả vouchers
const getAllVouchers = (req, res) => {
  VoucherModel.getAllVouchers((err, vouchers) => {
    if (err) {
        return res.status(500).json({ message: 'Error retrieving vouchers', error: err });
    }
    res.status(200).json(vouchers);
  });
};

// Lấy voucher theo ID
const getVoucherById = (req, res) => {
  const VoucherID = req.params.id;
  VoucherModel.getVoucherById(VoucherID, (err, voucher) => {
    if (err) {
        return res.status(500).json({ message: 'Error retrieving voucher', error: err });
    }
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.status(200).json(voucher);
  });
};
const getVoucherByCode = (req, res) => {
  const {code} = req.body;  // Lấy code từ params

  // Gọi model để tìm voucher theo code
  VoucherModel.getVoucherByCode(code, (err, voucher) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'Error retrieving voucher', error: err });
    }
    if (!voucher) {
      return res.status(404).json({ status: false, message: 'Voucher not found' });
    }
    // Correct the JSON format
    res.status(200).json({ status: true, code: voucher });
  });
};

// Thêm voucher mới
const createVoucher = (req, res) => {
  console.log(req.body);
  const newVoucher = {
    Code: req.body.Code,
    ExpiryDate: req.body.ExpiryDate,
    MinimumPurchaseAmount: req.body.MinimumPurchaseAmount,
    // quantityUsed: req.body.quantityUsed,       // Số lượng đã sử dụng
    usableQuantity: req.body.usableQuantity, // Số lượng có thể sử dụng
    status: req.body.status,                 // Trạng thái của voucher
    percent: req.body.percent                // Phần trăm giảm giá
  };

  VoucherModel.createVoucher(newVoucher, (err, insertId) => {
    if (err) {
        return res.status(500).json({ message: 'Error creating voucher', error: err });
    }
    res.status(201).json({ message: 'Voucher created successfully', VoucherID: insertId });
  });
};

// Cập nhật voucher
const updateVoucher = (req, res) => {
  const VoucherID = req.params.id;
  const updatedVoucher = {
    Code : req.body.Code ,
    ExpiryDate: req.body.ExpiryDate,
    MinimumPurchaseAmount: req.body.MinimumPurchaseAmount,
    quantityused: req.body.quantityused,       // Cập nhật số lượng đã sử dụng
    usablequantity: req.body.usablequantity, // Cập nhật số lượng có thể sử dụng
    status: req.body.status,                 // Cập nhật trạng thái
    percent: req.body.percent                // Cập nhật phần trăm giảm giá
  };

  VoucherModel.updateVoucher(VoucherID, updatedVoucher, (err) => {
    if (err) {
        return res.status(500).json({ message: 'Error updating voucher', error: err });
    }
    res.status(200).json({ message: 'Voucher updated successfully' });
  });
};

// Xóa voucher
const deleteVoucher = (req, res) => {
  const VoucherID = req.params.id;

  VoucherModel.deleteVoucher(VoucherID, (err) => {
    if (err) {
        return res.status(500).json({ status:false,message: 'Error deleting voucher', error: err });
    }
    res.status(200).json({status:true, message: 'Voucher deleted successfully' });
  });
};

// Xuất các hàm
module.exports = {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getVoucherByCode
};
