const ProvinceModel = require('../model/ProvinceModel');
const getAllProvince = (req, res) => {
    ProvinceModel.getAllProvinces((err, categories) => {
        if (err) {
            res.status(500).json({ message: 'Error creating category', error: err });
        }
        res.json(categories);
    });
};

module.exports={
    getAllProvince
}