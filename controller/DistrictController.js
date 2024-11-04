const DistrictModel = require('../model/DistrictModel');
const getDistrictModelById = (req, res) => {
    const province_id = req.query.id;
    console.log(province_id);

    DistrictModel.getDistrictById(province_id,(err, categories) => {
        if (err) {
            res.status(500).json({ message: 'Error creating WardsModel', error: err });
        }
        res.json(categories);
    });
};

module.exports={
    getDistrictModelById
}