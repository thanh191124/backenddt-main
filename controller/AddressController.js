const AddressModel = require('../model/AddressModel');

// Lấy tất cả địa chỉ
const getAllAddresses = (req, res) => {
    AddressModel.getAllAddresses((err, addresses) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching addresses', error: err });
        } else {
            res.json(addresses);
        }
    });
};

// Lấy địa chỉ theo UserID
const getAddressByUserId = (req, res) => {
    const UserID = req.body.UserID;  // Extract UserID from the body
    console.log(UserID);
    if (!UserID ) {
        return res.status(400).json({ message: 'UserID is required' });
    }

    AddressModel.getAddressesByUserId(UserID, (err, addresses) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching addresses for user', error: err });
        } else {
            res.json(addresses);
        }
    });
};
const getAddressByid = (req, res) => {
    const { idAddress } = req.query;  // Truy cập trực tiếp vào req.query
    console.log(idAddress)
    if (!idAddress) {
        return res.status(400).json({ message: 'Address, UserID, addressType, phone, and name are required' });
    }
    AddressModel.getAddressById(idAddress, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error adding address', error: err });
        } else {
            res.status(201).json({ message: 'Address added successfully', result });
        }
    });
};

// Thêm địa chỉ mới
const addAddress = (req, res) => {
    const { address, userId, addressType, phone, name, id_address } = req.body;

    // Log dữ liệu đầu vào để kiểm tra
    console.log("Request body: ", req.body);

    // Kiểm tra đầu vào bắt buộc
    if (!address || !addressType || !phone || !name || !userId) {
        console.error('Missing required fields: Address, UserID, addressType, phone, and name are required.');
        return res.status(400).json({ message: 'Address, UserID, addressType, phone, and name are required.' });
    }
    console.log(id_address);
    // Kiểm tra nếu có id_address thì cập nhật, nếu không thì thêm mới
    if (id_address!="null") {
        console.log("Updating address with ID:", id_address);
        AddressModel.updateAddress(id_address, address, addressType, phone, name, (err, result) => {
            if (err) {
                console.error('Error updating address:', err);
                return res.status(500).json({ message: 'Error updating address', error: err.message });
            } else if (result.affectedRows === 0) {
                console.warn('No rows matched for update.');
                return res.status(404).json({ message: 'Address not found or no changes made.' });
            } else {
                console.log("Address updated successfully:", result);
                return res.json({ message: 'Address updated successfully', result });
            }
        });
    } else {
        console.log("Adding new address for user ID:", userId);
        AddressModel.addAddress(address, userId, addressType, phone, name, (err, result) => {
            if (err) {
                console.error('Error adding address:', err);
                return res.status(500).json({ message: 'Error adding address', error: err.message });
            } else {
                console.log("Address added successfully:", result);
                return res.status(201).json({ message: 'Address added successfully', result });
            }
        });
    }
};


// Cập nhật địa chỉ
const updateAddress = (req, res) => {
    const { idAddress, address, addressType, phone, name } = req.body;

    if (!idAddress || !address || !addressType || !phone || !name) {
        return res.status(400).json({ message: 'Address ID, address, addressType, phone, and name are required' });
    }

    AddressModel.updateAddress(idAddress, address, addressType, phone, name, (err, result) => {
        if (err) {
            res.status(500).json({status:"fales", message: 'Error updating address', error: err });
        } else {
            res.json({status:"true", message: 'Address updated successfully', result });
        }
    });
};

// Xóa địa chỉ
const deleteAddress = (req, res) => {
    const { idAddress } = req.query;
    console.log(idAddress)

    if (!idAddress) {
        return res.status(400).json({status:"fales", message: 'Address ID is required' });
    }

    AddressModel.deleteAddress(idAddress, (err, result) => {
        if (err) {
            res.status(500).json({status:"fales" ,message: 'Error deleting address', error: err });
        } else {
            res.json({ status:"true",message: 'Address deleted successfully', result });
        }
    });
};

module.exports = {
    getAllAddresses,
    getAddressByUserId,
    addAddress,
    updateAddress,
    deleteAddress,
    getAddressByid
};
