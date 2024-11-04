const db = require('../config/db'); // Giả sử bạn đã có file kết nối với MySQL

const ProvinceModel = {
  // Lấy tất cả các tỉnh
  getAllProvinces: (callback) => {
    db.query('SELECT * FROM province', callback);
  },

};

module.exports = ProvinceModel;
