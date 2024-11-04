const WardsModel = require('../model/WardsModel');
const getWardsByID = (req, res) => {
    const district_id = req.query.id;

    WardsModel.getWardById(district_id,(err, categories) => {
        if (err) {
            res.status(500).json({ message: 'Error creating WardsModel', error: err });
        }
        res.json(categories);
    });
};

module.exports={
    getWardsByID
}