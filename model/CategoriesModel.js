const db = require('../config/db'); // Import kết nối đến MySQL từ db.js

// Lấy tất cả category
const getAllCategories = (callback) => {
    const query = `
        SELECT c.*, COUNT(p.CategoryID ) AS product_count 
        FROM category c
        LEFT JOIN product p ON c.CategoryID  = p.CategoryID 
        GROUP BY c.CategoryID 
    `;

    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};
const getCategoriesWithProducts = (callback) => {
    const query = `
        SELECT 
            c.CategoryID, 
            c.CategoryName, 
            p.ProductID, 
            p.ProductName, 
            p.Price,
            pi.ImageID,
            pi.OtherImages
        FROM 
            category c
        LEFT JOIN 
            product p ON c.CategoryID = p.CategoryID 
        LEFT JOIN 
            productimage pi ON p.ProductID = pi.ProductID
        WHERE 
            p.status = 'active'  -- Chỉ lấy sản phẩm có trạng thái 'active'
        ORDER BY 
            c.CategoryID, p.ProductID
    `;

    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        // Chuyển đổi kết quả thành định dạng mong muốn
        const categories = [];
        results.forEach(row => {
            const category = categories.find(cat => cat.CategoryID === row.CategoryID);
            if (!category) {
                categories.push({
                    CategoryID: row.CategoryID,
                    CategoryName: row.CategoryName,
                    Products: row.ProductID ? [{
                        ProductID: row.ProductID,
                        ProductName: row.ProductName,
                        ProductPrice: row.Price,
                        ImageID: row.ImageID,
                        OtherImages: row.OtherImages ? row.OtherImages.split(',') : [] // Chia nhỏ nếu cần
                    }] : []
                });
            } else {
                if (row.ProductID) {
                    const product = category.Products.find(prod => prod.ProductID === row.ProductID);
                    if (!product) {
                        category.Products.push({
                            ProductID: row.ProductID,
                            ProductName: row.ProductName,
                            ProductPrice: row.Price,
                            ImageID: row.ImageID,
                            OtherImages: row.OtherImages ? row.OtherImages.split(',') : [] // Chia nhỏ nếu cần
                        });
                    }
                }
            }
        });

        return callback(null, categories);
    });
};


// Lấy category theo ID
const getCategoryById = (categoryId, callback) => {
    db.query('SELECT * FROM category WHERE CategoryID = ?', [categoryId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Tạo mới category
const createCategory = (categoryData, callback) => {
    const { CategoryName, Description, ImageURL, status = 0, location } = categoryData; // Thiết lập giá trị mặc định cho status
    console.log(categoryData);
    db.query(
        'INSERT INTO category (CategoryName, Description, ImageURL, status, location) VALUES (?, ?, ?, ?, ?)',
        [CategoryName, Description, ImageURL, status, location],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    );
};


// Cập nhật category theo ID
const updateCategory = (categoryId, categoryData, callback) => {
    const { CategoryName, Description, ImageURL,location } = categoryData;
    db.query('UPDATE category SET CategoryName = ?, Description = ?, ImageURL = ? ,location = ? WHERE CategoryID = ?', 
    [CategoryName, Description, ImageURL,location, categoryId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

// Xóa category theo ID
const deleteCategory = (categoryId, callback) => {
    // Bước 1: Kiểm tra xem có sản phẩm nào liên kết với danh mục này không
    db.query('SELECT COUNT(*) AS productCount FROM product WHERE CategoryID = ?', [categoryId], (err, result) => {
        if (err) {
            return callback(err, null);
        }

        // Bước 2: Kiểm tra số lượng sản phẩm
        const productCount = result[0].productCount;
        if (productCount > 0) {
            // Nếu có sản phẩm, không xóa danh mục và trả về thông báo lỗi
            return callback(new Error('Không thể xóa danh mục vì vẫn còn sản phẩm liên kết.'), null);
        }

        // Bước 3: Nếu không có sản phẩm, tiến hành xóa danh mục
        db.query('DELETE FROM category WHERE CategoryID = ?', [categoryId], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    });
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesWithProducts
};
