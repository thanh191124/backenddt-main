// models/OrderModel.js
const db = require('../config/db');

// Lấy tất cả order
const getAllOrders = (callback) => {
    const query = `
        SELECT o.*, u.Username
        FROM \`order\` o
        LEFT JOIN \`user\` u ON o.UserID = u.UserID
        ORDER BY o.TimeBuy DESC; -- Sắp xếp theo thời gian mua mới nhất
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null); // Trả về lỗi nếu có
        }
        callback(null, results); // Trả về kết quả nếu thành công
    });
};



// Lấy order theo ID
const getOrderById = (orderId, callback) => {
    db.query('SELECT * FROM order WHERE OrderID = ?', [orderId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};
const updateOrderStatus = (orderID, orderData, callback) => {
    const { Status, PaymentStatus } = orderData;

    // Câu lệnh SQL để cập nhật trạng thái đơn hàng
    db.query(
        'UPDATE `order` SET Status = ?, PaymentStatus = ? WHERE OrderID = ?',
        [Status, PaymentStatus, orderID],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    );
};
const getMonthlyOrderSummary = (callback) => {
    const query = `
        SELECT 
            MONTH(OrderDate) AS month, 
            COUNT(OrderID) AS totalOrders, 
            SUM(TotalAmount) AS totalRevenue 
        FROM 
            \`order\` 
        WHERE 
            YEAR(OrderDate) = YEAR(CURDATE())  -- Lấy đơn hàng của năm hiện tại
            AND PaymentStatus = 'Đã Thanh Toán'  -- Chỉ lấy đơn hàng đã thanh toán thành công
        GROUP BY 
            MONTH(OrderDate)
        ORDER BY 
            month ASC;  -- Sắp xếp theo tháng
    `;

    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        // Tạo một mảng 12 phần tử, khởi tạo với 0 cho số lượng đơn hàng và tổng doanh thu
        const monthlySummary = Array.from({ length: 12 }, () => ({
            month: '',
            totalOrders: 0,
            totalRevenue: 0 
        }));

        // Tên tháng
        const monthNames = [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", 
            "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", 
            "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ];

        // Lặp qua kết quả để cập nhật số lượng đơn hàng và doanh thu theo tháng
        results.forEach(row => {
            monthlySummary[row.month - 1] = {
                month: monthNames[row.month - 1],  // Thêm tên tháng
                totalOrders: row.totalOrders,
                totalRevenue: row.totalRevenue
            };
        });

        callback(null, monthlySummary);
    });
};

const getTotalOrders = (callback) => {
    // Truy vấn SQL để lấy tổng số đơn hàng có PaymentStatus là 'unpaid'
    db.query('SELECT COUNT(OrderID) AS totalUnpaidCount FROM `order` WHERE PaymentStatus = ?', ['unpaid'], (err, unpaidResult) => {
        if (err) {
            return callback(err, null);
        }

        // Truy vấn SQL để lấy tổng số tiền cho các đơn hàng đã thanh toán
        db.query('SELECT SUM(TotalAmount) AS totalPaid FROM `order` WHERE PaymentStatus = ?', ['Đã Thanh Toán'], (err, paidResult) => {
            if (err) {
                return callback(err, null);
            }

            // Trả về kết quả tổng hợp
            const totalUnpaid = unpaidResult[0]?.totalUnpaidCount || 0; // Sử dụng optional chaining để đảm bảo không lỗi
            const totalPaid = paidResult[0]?.totalPaid || 0; // Sử dụng optional chaining

            callback(null, {
                totalUnpaid,
                totalPaid
            });
        });
    });
};


// Tạo mới order
const createOrder = (orderData, callback) => {
    const { UserID, TotalAmount, Status, PaymentStatus, VoucherID, TotalDiscount, codeorder, TimeBuy, address ,recipientName, recipientPhone,addresstype,PaymentType} = orderData;

    // Sử dụng backticks để xử lý tên bảng 'order'
    db.query('INSERT INTO `order` (UserID, OrderDate, TotalAmount, Status, PaymentStatus, VoucherID, TotalDiscount, codeorder, TimeBuy, address,recipientName, recipientPhone,addresstype,PaymentType) VALUES (?, NOW(), ?, ?,?, ?, ?, ?, ?, ?, ?,?,?,?)', 
    [UserID, TotalAmount, Status || 'pending', PaymentStatus || 'unpaid', VoucherID || null, TotalDiscount || 0, codeorder, TimeBuy, address,recipientName, recipientPhone,addresstype,PaymentType], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};
const searchOrders = (searchCriteria, callback) => {
    // Khởi tạo điều kiện tìm kiếm
    let query = 'SELECT * FROM `order` WHERE 1=1'; // 1=1 giúp dễ dàng thêm điều kiện
    const values = [];
 
    // Thêm các tiêu chí tìm kiếm vào câu truy vấn
    if (searchCriteria.UserID) {
        query += ' AND UserID = ?';
        values.push(searchCriteria.UserID);
    }
    if (searchCriteria.codeorder) {
        query += ' AND codeorder = ?';
        values.push(searchCriteria.codeorder);
    }
    if (searchCriteria.Status) {
        query += ' AND Status = ?';
        values.push(searchCriteria.Status);
    }
    if (searchCriteria.PaymentStatus) {
        query += ' AND PaymentStatus = ?';
        values.push(searchCriteria.PaymentStatus);
    }
    if (searchCriteria.TimeBuy) {
        query += ' AND TimeBuy >= ?'; // Lấy đơn hàng từ một thời gian nhất định
        values.push(searchCriteria.TimeBuy);
    }

    // Thực hiện truy vấn
    db.query(query, values, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};



// Cập nhật order
const updateOrder = (orderId, orderData, callback) => {
    const { TotalAmount, Status, PaymentStatus, TotalDiscount, codeorder, TimeBuy, address } = orderData;
    db.query('UPDATE order SET TotalAmount = ?, Status = ?, PaymentStatus = ?, TotalDiscount = ?, codeorder = ?, TimeBuy = ?, address = ? WHERE OrderID = ?', 
    [TotalAmount, Status, PaymentStatus, TotalDiscount, codeorder, TimeBuy, address, orderId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Xóa order theo ID
const deleteOrder = (orderId, callback) => {
    db.query('DELETE FROM order WHERE OrderID = ?', [orderId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};
// Lấy danh sách đơn hàng theo UserID
const getOrdersByUserId = (userId, callback) => {
    const query = 'SELECT * FROM `order` WHERE UserID = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersByUserId,
    searchOrders,
    updateOrderStatus,
    getTotalOrders,
    getMonthlyOrderSummary
};
