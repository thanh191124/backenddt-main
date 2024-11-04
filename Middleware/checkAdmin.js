const jwt = require('jsonwebtoken');

// Middleware kiểm tra quyền admin
const checkAdmin = (req, res, next) => {
    const token = req.headers['authorization']; // Lấy token từ header
    console.log(token)
    if (!token) {
        return res.status(403).json({ status: false, message: 'Chưa xác thực' });
    }

    // Giải mã token để lấy thông tin người dùng
    jwt.verify(token, 'f41f956113567cab67efe66b3c4a41c92af08c4f30f61befcd400773a0cb62d52ca28506fd75124432da68b00064352c335c39066c7bd81b257bb6a137e783c2', (err, decoded) => {
        console.log(decoded); // Xem nội dung của token

        if (err) {
            return res.status(401).json({ status: false, message: 'Token không hợp lệ' });
        }

        // Kiểm tra vai trò người dùng
        if (decoded.Role !== 'Admin') { // Kiểm tra xem vai trò có phải là 'admin' hay không
            return res.status(403).json({ status: false, message: 'Không có quyền truy cập' });
        }

        // Nếu kiểm tra thành công, chuyển sang middleware tiếp theo hoặc route handler
        next();
    });
};

module.exports = checkAdmin; // Xuất middleware
