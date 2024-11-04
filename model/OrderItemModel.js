const db = require('../config/db');

// Lấy tất cả order items
const getAllorderitem = (callback) => {
    db.query('SELECT * FROM `orderitem`', (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// Lấy order item theo ID
const getOrderItemByOrderId = (orderId, callback) => {
    const sql = `
        SELECT oi.OrderItemID, 
               oi.OrderID, 
               oi.ProductID, 
               oi.Quantity, 
               oi.Price,
               p.ProductName,
               p.Price AS ProductPrice,
               p.StockQuantity,
               p.CategoryID,
               p.CreationTime,
               p.Priority,
               o.Status,
               o.TimeBuy,
               o.TotalDiscount,
               o.UserID ,
               o.address,
               o.codeorder,
               o.TotalAmount,
               o.AddressType,        -- Thêm cột AddressType từ bảng orders
               o.RecipientPhone,     -- Thêm cột RecipientPhone từ bảng orders
               o.RecipientName       -- Thêm cột RecipientName từ bảng orders
        FROM orderitem AS oi
        JOIN product AS p ON oi.ProductID = p.ProductID
        JOIN \`order\` AS o ON oi.OrderID = o.OrderID  -- Thực hiện JOIN với bảng orders
        WHERE oi.OrderID = ?
    `;

    db.query(sql, [orderId], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        if (results.length === 0) {
            return callback(null, null); // Không tìm thấy đơn hàng
        }

        // Tạo đối tượng kết quả với thông tin đơn hàng
        const orderDetails = {
            codeorder: results[0].codeorder,
            UserID : results[0].UserID ,
            OrderID: results[0].OrderID,
            Status: results[0].Status,
            TimeBuy: results[0].TimeBuy,
            TotalAmount: results[0].TotalAmount,
            TotalDiscount: results[0].TotalDiscount,
            Address: results[0].address,
            AddressType: results[0].AddressType,
            RecipientPhone: results[0].RecipientPhone,
            RecipientName: results[0].RecipientName,
            Products: [] // Khởi tạo mảng sản phẩm
        };

        // Lặp qua các kết quả để thêm sản phẩm vào mảng
        results.forEach(item => {
            orderDetails.Products.push({
                OrderItemID: item.OrderItemID,
                ProductID: item.ProductID,
                Quantity: item.Quantity,
                Price: item.Price,
                ProductName: item.ProductName,
                ProductPrice: item.ProductPrice,
                StockQuantity: item.StockQuantity,
                CategoryID: item.CategoryID,
                CreationTime: item.CreationTime,
                Priority: item.Priority,
            });
        });

        callback(null, orderDetails); // Trả về đối tượng kết quả
    });
};






// Tạo mới order item
const createOrderItem = (orderItemData, callback) => {
    const { OrderID, ProductID, Quantity, Price } = orderItemData;

    // Đảm bảo câu lệnh SQL sử dụng dấu backticks cho tên bảng
    db.query('INSERT INTO `orderitem` (OrderID, ProductID, Quantity, Price) VALUES (?, ?, ?, ?)', 
    [OrderID, ProductID, Quantity, Price], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Cập nhật order item
const updateOrderItem = (orderItemId, orderItemData, callback) => {
    const { Quantity, Price } = orderItemData;

    // Đảm bảo câu lệnh SQL sử dụng dấu backticks cho tên bảng
    db.query('UPDATE `orderitem` SET Quantity = ?, Price = ? WHERE OrderItemID = ?', 
    [Quantity, Price, orderItemId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Xóa order item theo ID
const deleteOrderItem = (orderItemId, callback) => {
    db.query('DELETE FROM `orderitem` WHERE OrderItemID = ?', [orderItemId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

module.exports = {
    getAllorderitem,
    getOrderItemByOrderId,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem,
    
};
