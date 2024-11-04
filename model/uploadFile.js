const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/')); // Sử dụng path.join để tạo đường dẫn chính xác
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter to only accept certain file types (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
};
const deleteImage = (imageName, callback) => {
    const filePath = path.join(__dirname, '../uploads/', imageName); // Tạo đường dẫn chính xác đến file

    fs.unlink(filePath, (err) => {
        if (err) {
            return callback(err); // Gọi callback với lỗi nếu có
        }
        callback(null); // Gọi callback không có lỗi
    });
};
// Set up multer middleware with file size limit and file filter

const category = multer({
    storage: storage, // đảm bảo rằng `storage` đã được định nghĩa
    fileFilter: fileFilter // đảm bảo `fileFilter` đã được định nghĩa
}).single('ImageURL'); // 'ImageURL' phải là tên của field trong form HTML
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('MainImage'); // Use 'productImage' as the form field name for file upload
const imgproductorder = multer({
    storage: storage,
    fileFilter: fileFilter // Đảm bảo `fileFilter` đã được định nghĩa
}).array('OtherImages', 5); // Cho phép upload tối đa 10 hình ảnh

module.exports = {upload,category,imgproductorder,deleteImage};
