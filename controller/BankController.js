const BankAccountModel = require('../model/BankModel');

// Lấy tất cả tài khoản ngân hàng
const getAllAccounts = (req, res) => {
    BankAccountModel.getAllAccounts((err, accounts) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching bank accounts', error: err });
        } else {
            res.json(accounts);
        }
    });
};

// Lấy tài khoản ngân hàng theo ID
const getAccountById = (req, res) => {
    const id = req.params.id; // Truy cập ID từ tham số đường dẫn
    BankAccountModel.getAccountById(id, (err, account) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching bank account', error: err });
        } else if (account.length === 0) {
            res.status(404).json({ message: 'Bank account not found' });
        } else {
            res.json(account);
        }
    });
};

// Thêm tài khoản ngân hàng mới
const addAccount = (req, res) => {
    const { account_number, bank_name, account_holder, transaction_description, image_url } = req.body;
    console.log(req.body);
    if (!account_number || !bank_name || !account_holder) {
        return res.status(400).json({ message: 'account_number, bank_name, and account_holder are required' });
    }

    BankAccountModel.addAccount(account_number, bank_name, account_holder, transaction_description, image_url, (err, result) => {
        if (err) {
            res.status(500).json({ status:false,message: 'Error adding bank account', error: err });
        } else {
            res.status(201).json({status:true, message: 'Bank account added successfully', result });
        }
    });
};

// Cập nhật thông tin tài khoản ngân hàng
const updateAccount = (req, res) => {
    const id = req.params.id; // Truy cập ID từ tham số đường dẫn

    const {  account_number, bank_name, account_holder, transaction_description, image_url } = req.body;

    if (!id || !account_number || !bank_name || !account_holder) {
        return res.status(400).json({ message: 'ID, account_number, bank_name, and account_holder are required' });
    }

    BankAccountModel.updateAccount(id, account_number, bank_name, account_holder, transaction_description, image_url, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error updating bank account', error: err });
        } else {
            res.json({ message: 'Bank account updated successfully', result });
        }
    });
};

// Xóa tài khoản ngân hàng
const deleteAccount = (req, res) => {
    const { id } = req.params; // Truy cập ID từ tham số đường dẫn

    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }

    BankAccountModel.deleteAccount(id, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error deleting bank account', error: err });
        } else {
            res.json({ message: 'Bank account deleted successfully', result });
        }
    });
};

module.exports = {
    getAllAccounts,
    getAccountById,
    addAccount,
    updateAccount,
    deleteAccount
};
