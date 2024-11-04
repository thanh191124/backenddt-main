const db = require('../config/db'); // Import kết nối đến MySQL từ db.js

const productModel = {
    // Lấy tất cả sản phẩm cùng với số lượng đã bán
    updateStockQuantity: (productId, quantityToUpdate, callback) => {
        const query = `
            UPDATE product 
            SET StockQuantity = StockQuantity - ? 
            WHERE ProductID = ? AND StockQuantity >= ?
        `;

        if (quantityToUpdate <= 0) {
            return callback(new Error('Quantity must be greater than 0'), null);
        }

        db.query(query, [quantityToUpdate, productId, quantityToUpdate], (err, result) => {
            if (err) {
                return callback(err, null);
            }

            if (result.affectedRows === 0) {
                return callback(new Error('Stock quantity update failed or insufficient stock'), null);
            }

            callback(null, { message: 'Stock quantity updated successfully', affectedRows: result.affectedRows });
        });
    },
    getAllProducts: (callback) => {
        const query = `
            SELECT p.*, 
                   pi.OtherImages, 
                   c.CategoryID AS CategoryID, 
                   c.CategoryName AS CategoryName, 
                   COALESCE(SUM(oi.Quantity), 0) AS TotalQuantitySold
            FROM product p
            LEFT JOIN productimage pi ON p.ProductID = pi.ProductID
            LEFT JOIN category c ON p.CategoryID = c.CategoryID
            LEFT JOIN orderitem oi ON p.ProductID = oi.ProductID
            WHERE p.status = 'active'   -- Filter for active status
            GROUP BY p.ProductID
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
    
            const productsMap = {};
    
            results.forEach(row => {
                const { ProductID, ProductName, Description, Price, StockQuantity, status, ShortDescription, OtherImages, CategoryID, CategoryName, Creationtime, Priority, TotalQuantitySold } = row;
    
                if (!productsMap[ProductID]) {
                    productsMap[ProductID] = {
                        ProductID,
                        ProductName,
                        Description,
                        Price,
                        StockQuantity,
                        CategoryID,          // ID danh mục
                        CategoryName,        // Tên danh mục
                        status,
                        Priority,
                        Creationtime,
                        ShortDescription,
                        OtherImages: [],     // Initialize as an array
                        TotalQuantitySold    // Số lượng đã bán
                    };
                }
    
                // Push the OtherImages to the product's images array
                if (OtherImages) {
                    productsMap[ProductID].OtherImages.push(OtherImages);
                }
            });
    
            // Convert the map back to an array
            const consolidatedProducts = Object.values(productsMap);
    
            callback(null, consolidatedProducts);
        });
    },
    
    getOldImages: (productId, callback) => {
        const query = 'SELECT OtherImages FROM productimage WHERE ProductID = ?';
        const values = [productId];
    
        db.query(query, values, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    getAllProductsNoStatus: (callback) => {
        const query = `
            SELECT p.*, 
                   pi.OtherImages, 
                   c.CategoryID AS CategoryID, 
                   c.CategoryName AS CategoryName, 
                   COALESCE(SUM(oi.Quantity), 0) AS TotalQuantitySold
            FROM product p
            LEFT JOIN productimage pi ON p.ProductID = pi.ProductID
            LEFT JOIN category c ON p.CategoryID = c.CategoryID
            LEFT JOIN orderitem oi ON p.ProductID = oi.ProductID
            GROUP BY p.ProductID
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
    
            const productsMap = {};
    
            results.forEach(row => {
                const { ProductID, ProductName, Description, Price, StockQuantity, status, ShortDescription, OtherImages, CategoryID, CategoryName, Creationtime, Priority, TotalQuantitySold } = row;
    
                if (!productsMap[ProductID]) {
                    productsMap[ProductID] = {
                        ProductID,
                        ProductName,
                        Description,
                        Price,
                        StockQuantity,
                        CategoryID,          // ID danh mục
                        CategoryName,        // Tên danh mục
                        status,
                        Priority,
                        Creationtime,
                        ShortDescription,
                        OtherImages: [],     // Initialize as an array
                        TotalQuantitySold    // Số lượng đã bán
                    };
                }
    
                // Push the OtherImages to the product's images array
                if (OtherImages) {
                    productsMap[ProductID].OtherImages.push(OtherImages);
                }
            });
    
            // Convert the map back to an array
            const consolidatedProducts = Object.values(productsMap);
    
            callback(null, consolidatedProducts);
        });
    },

    // Lấy sản phẩm theo ProductID
    getProductById: (id, callback) => {
        const query = 'SELECT * FROM product WHERE ProductID = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    },
    getProductsNew: (callback) => {
        const query = `
            SELECT p.*, 
                   GROUP_CONCAT(pi.OtherImages) AS OtherImages
            FROM product p
            LEFT JOIN productimage pi ON p.ProductID = pi.ProductID
            WHERE p.status = 'active'   -- Filter for active status
            GROUP BY p.ProductID
            ORDER BY p.Creationtime DESC
            LIMIT 10
        `;
        
        db.query(query, (err, result) => {
            if (err) {
                return callback(err, null); // Return error if any
            }
    
            // Parse the OtherImages string into an array
            result.forEach(product => {
                product.OtherImages = product.OtherImages ? product.OtherImages.split(',') : [];
            });
    
            callback(null, result); // Return the result
        });
    },
    
    
    
    deleteOldImages: (productId, callback) => {
        const sql = 'DELETE FROM productimage WHERE ProductID = ?'; 
        db.query(sql, [productId], (err, result) => {
            if (err) {
                console.error('Error deleting old images:', err);
                if (typeof callback === 'function') {
                    return callback(err);
                }
            }
            if (typeof callback === 'function') {
                callback(null, result);
            }
        });
    },
    
    
    updateProduct: (updatedProduct, callback) => {
        const query = `
            UPDATE product
            SET 
                ProductName = COALESCE(?, ProductName),
                Description = COALESCE(?, Description),
                Price = COALESCE(?, Price),
                StockQuantity = COALESCE(?, StockQuantity),
                CategoryID = COALESCE(?, CategoryID),
                status = COALESCE(?, status),
                ShortDescription = COALESCE(?, ShortDescription)
            WHERE ProductID = ?`;
            
        const values = [
            updatedProduct.ProductName,
            updatedProduct.Description,
            updatedProduct.Price,
            updatedProduct.StockQuantity,
            updatedProduct.CategoryID,
            updatedProduct.status,
            updatedProduct.ShortDescription,
            updatedProduct.ProductID,
        ];
    
        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    },
    // Tạo sản phẩm mới
    createProduct: (newProduct, callback) => {
        const query = 'INSERT INTO product (ProductName, Description, Price, StockQuantity, CategoryID, status,ShortDescription) VALUES (?, ?, ?, ?, ?, ?,?)';
        const values = [newProduct.ProductName, newProduct.Description, newProduct.Price, newProduct.StockQuantity, newProduct.CategoryID, newProduct.status,newProduct.ShortDescription];
        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    },
   
    
    productImageModel : (imageData, callback) => {
        // Lưu thông tin hình ảnh vào cơ sở dữ liệu
        const sql = 'INSERT INTO productimage SET ?'; // Câu lệnh SQL để chèn hình ảnh
        db.query(sql, imageData, (err, result) => {
            if (err) return callback(err); 
            callback(null, result);
        });
    },
    // Xóa sản phẩm theo ProductID
  // Hàm kiểm tra nếu sản phẩm có liên kết với đơn hàng
  checkProductOrders: (productId, callback) => {
    const query = 'SELECT COUNT(*) AS orderCount FROM orderitem WHERE ProductID = ?';
    db.query(query, [productId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        
        // Kiểm tra kết quả trả về
        console.log('Query result:', results);
        
        const hasOrders = results[0].orderCount > 0; // Có đơn hàng hay không
        callback(null, hasOrders); // Trả về true nếu có đơn hàng, false nếu không
    });
},



// Hàm xóa sản phẩm nếu không có đơn hàng
deleteProductById: (id, callback) => {
    const query = 'DELETE FROM product WHERE ProductID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return callback(err, null); // Trả về lỗi nếu có
        }
        // Kiểm tra xem có bản ghi nào bị xóa không
        if (result.affectedRows === 0) {
            return callback(new Error('Product not found'), null); // Nếu không tìm thấy sản phẩm để xóa
        }
        callback(null, result); // Trả về kết quả nếu xóa thành công
    });
},

    // Cập nhật trạng thái (status) của sản phẩm
    updateProductStatus: (id, newStatus, callback) => {
        const query = 'UPDATE product SET status = ? WHERE ProductID = ?';
        db.query(query, [newStatus, id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }
};

module.exports = productModel;
