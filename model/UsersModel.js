const db = require('../config/db'); // Import kết nối đến MySQL từ db.js
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = {
    // Lấy tất cả người dùng
    getAllUsers: (callback) => {
        const query = 'SELECT * FROM user';
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    findUserByEmailAndToken: (email, tokenuser, callback) => {
        const query = 'SELECT * FROM user WHERE email = ? AND tokenuser = ?';
        db.query(query, [email, tokenuser], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            // Kiểm tra nếu người dùng được tìm thấy
            if (results.length > 0) {
                callback(null, results[0]); // Trả về người dùng đầu tiên
            } else {
                callback(null, null); // Không tìm thấy người dùng
            }
        });
    },
    // Lấy người dùng theo UserID
    getUserById: (id, callback) => {
        const query = 'SELECT * FROM user WHERE UserID = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    },
    countUsersz: (callback) => {
        const query = 'SELECT COUNT(*) AS totalUsers FROM user';
        
        db.query(query, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            console.log("Kết quả truy vấn:", result);  // In ra kết quả truy vấn
            if (result && result.length > 0) {
                callback(null, result[0].totalUsers); // Trả về kết quả
            } else {
                callback(new Error('No result found'), null);
            }
        });
    },
    
    
    // Tạo người dùng mới
    createUser: (newUser, callback) => {
        const query = 'INSERT INTO user (Username, Password, Email, PhoneNumber, Address, Role, status, tokenuser) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            newUser.Username,
            newUser.Password,
            newUser.Email,
            newUser.PhoneNumber,
            newUser.Address,
            newUser.Role,
            'active', // Gán giá trị 'active' cho status
            newUser.tokenuser
        ];
        
        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    },
    getUserByToken: (token, callback) => {
        const query = 'SELECT * FROM user WHERE tokenuser = ?';
        const values = [token];
    
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', err);
                return callback(err, null);
            }
    
            if (result.length > 0) {
                console.log('Người dùng tìm thấy:', result[0]); // Log người dùng tìm thấy
                callback(null, result[0]);
            } else {
                console.log('Không tìm thấy người dùng với token:', token); // Log trường hợp không tìm thấy
                callback(null, null);
            }
        });
    },
    
    
    
    checkEmailExists: (email, callback) => {
        const query = 'SELECT tokenuser FROM user WHERE Email = ?'; // Removed email from the SELECT statement since it's not used in the callback.
        const values = [email];
    
        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
    
            // Check if any user was found
            if (result.length > 0) {
                // Return the tokenuser of the found email
                callback(null, result[0].tokenuser);
            } else {
                // If no user found, return null
                callback(null, null);
            }
        });
    },
    
    updatePassword: (email, newPassword) => {
        const hashedPassword = bcrypt.hashSync(newPassword, 10); // Mã hóa mật khẩu
        const timestamp = Date.now(); // Lấy thời gian hiện tại
        const tokenuser = crypto.createHash('sha256').update(`${email}${timestamp}`).digest('hex'); // Kết hợp email và timestamp

        const query = 'UPDATE user SET 	Password = ?, tokenuser = ? WHERE Email  = ?';
        const values = [hashedPassword, tokenuser, email]; // Đảm bảo truyền vào đúng giá trị

        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },
        
    // Model để tìm kiếm người dùng theo email
findUserByEmail: (email, callback) => {
    const query = 'SELECT * FROM user WHERE Email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        // Trả về người dùng đầu tiên (nếu có)
        callback(null, results.length > 0 ? results[0] : null);
    });
},

    // Cập nhật thông tin người dùng
    updateUser: (id, updatedUser, callback) => {
        const query = 'UPDATE user SET Username = ?, Password = ?, Email = ?, PhoneNumber = ?, Address = ?, Role = ? WHERE UserID = ?';
        const values = [updatedUser.Username, updatedUser.Password, updatedUser.Email, updatedUser.PhoneNumber, updatedUser.Address, updatedUser.Role, id];
        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    },

        // Hàm cập nhật người dùng
        updateUsers: ( updatedUser, callback) => {
            const fields = [];
            const values = [];
            const UserID  = updatedUser.UserID
            // Kiểm tra các thuộc tính có trong updatedUser và thêm vào mảng fields và values
            if (updatedUser.Username) {
                fields.push('Username = ?');
                values.push(updatedUser.Username);
            }
            if (updatedUser.Password) {
                fields.push('Password = ?');
                values.push(updatedUser.Password);
            }
            if (updatedUser.Email) {
                fields.push('Email = ?');
                values.push(updatedUser.Email);
            }
            if (updatedUser.PhoneNumber) {
                fields.push('PhoneNumber = ?');
                values.push(updatedUser.PhoneNumber);
            }
            if (updatedUser.Address) {
                fields.push('Address = ?');
                values.push(updatedUser.Address);
            }
            if (updatedUser.Role) {
                fields.push('Role = ?');
                values.push(updatedUser.Role);
            }
            if (updatedUser.status) {
                fields.push('status = ?');
                values.push(updatedUser.status);
            }
    
            // Thêm ID người dùng vào cuối mảng values
            values.push(UserID );
    
            // Tạo câu truy vấn SQL
            const query = `UPDATE user SET ${fields.join(', ')} WHERE UserID  = ?`;
    
            // Thực hiện truy vấn
            db.query(query, values, (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            });
        },
    // Cập nhật trạng thái người dùng
    updateUserStatus: (id, newStatus, callback) => {
        const query = 'UPDATE user SET status = ? WHERE UserID = ?';
        db.query(query, [newStatus, id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }
};

module.exports = userModel;
