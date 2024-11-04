const categoryModel = require('../model/CategoriesModel');
const {upload,category} = require('../model/uploadFile'); // Import the file upload module

// Lấy tất cả categories
const getAllCategories = (req, res) => {
    categoryModel.getAllCategories((err, categories) => {
        if (err) {
            res.status(500).json({ message: 'Error creating category', error: err });
        }
        res.json(categories);
    });
};
const getCategoriesWithProducts = (req, res) => {
    categoryModel.getCategoriesWithProducts((err, categories) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving categories and products', error: err });
        }
        return res.json(categories);
    });
};

// Lấy category theo ID
const getCategoryById = (req, res) => {
    const categoryId = req.params.id;
    categoryModel.getCategoryById(categoryId, (err, category) => {
        if (err) {
            res.status(500).json({ message: 'Error creating category', error: err });
        }
        res.json(category);
    });
};

const createCategory = (req, res) => {
    console.log(req.body);
    category(req, res, (err) => {  // Sử dụng multer middleware đã khai báo trước đó
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        }
        
        // Kiểm tra xem multer đã upload file chưa
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Lấy thông tin file từ req.file
        const uploadedFileName = req.file.filename; // Tên file đã được multer đổi
        console.log("File đã upload:", uploadedFileName);
        console.log(req.body)

        // Gán tên file vào categoryData
        const categoryData = {
            ...req.body,    // Các dữ liệu từ form
            ImageURL: uploadedFileName, // Tên file đã upload
        };

        // Lưu category vào database
        categoryModel.createCategory(categoryData, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error creating category', error: err });
            }
            res.status(201).json({ message: 'Category created', categoryId: result.insertId });
        });
    });
};



// Cập nhật category theo ID
const updateCategory = (req, res) => {
    category(req, res, (err) => {  // Sử dụng multer middleware đã khai báo trước đó
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        }
        
        // Kiểm tra xem multer đã upload file chưa
        const categoryId = req.params.id;
        const categoryData = req.body;

        // Nếu có file mới, cập nhật đường dẫn file mới vào categoryData
        if (req.file) {
            categoryData.ImageURL = req.file.filename; // Hoặc đường dẫn đến file bạn muốn lưu
        }

        categoryModel.getCategoryById(categoryId, (err, existingCategory) => {
            if (err) {
                return res.status(500).send('Error fetching existing category');
            }

            // Chỉ cập nhật các trường cần thiết
            const updatedData = {
                CategoryName: categoryData.CategoryName || existingCategory.CategoryName,
                Description: categoryData.Description || existingCategory.Description,
                ImageURL: categoryData.ImageURL || existingCategory.ImageURL,
                status: categoryData.status || existingCategory.status,
                location: categoryData.location || existingCategory.location,
            };

            categoryModel.updateCategory(categoryId, updatedData, (err, result) => {
                if (err) {
                    return res.status(500).send('Error updating category');
                }
                res.json({ message: 'Category updated' });
            });
        });
    });
};


// Xóa category theo ID
const deleteCategory = (req, res) => {
    const {categoryId} = req.body;
    console.log(req.body);
    categoryModel.deleteCategory(categoryId, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error creating category', error: err });
        }
        res.json({ message: 'Category deleted' });
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
