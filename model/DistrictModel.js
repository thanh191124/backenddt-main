const db = require('../config/db'); // Giả sử bạn đã có file kết nối với MySQL

const DistrictModel = {
  // Lấy tất cả các tỉnh
  getDistrictById: (province_id,callback) => {
    db.query('SELECT * FROM district WHERE province_id = ?',[province_id], callback);
  },

};

module.exports = DistrictModel;
