const mysql = require('mysql');

// Cấu hình kết nối
const dbConfig = {
    host: 'localhost',
    user: 'root', // Thay thế bằng username của bạn
    password: '', // Thay thế bằng password của bạn
    port: '3306',
    database: 'webbandientu' // Thay thế bằng tên database bạn muốn kết nối
};

// Tạo kết nối
// const connection = mysql.createConnection(dbConfig);

// Tạo kết nối sử dụng DATABASE_URL từ biến môi trường
const connection = mysql.createConnection(process.env.DATABASE_URL);

// Kết nối đến cơ sở dữ liệu
connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

// Xuất kết nối để tái sử dụng
module.exports = connection;
