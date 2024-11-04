const db = require('../config/db'); // Giả sử bạn đã có file kết nối với MySQL

const WardsModel = {
  // Lấy tất cả các tỉnh
  getWardById: (district_id,callback) => {
    db.query('SELECT * FROM wards WHERE district_id = ?',[district_id], callback);
  },

};

module.exports = WardsModel;
