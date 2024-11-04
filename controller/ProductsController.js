const productModel = require('../model/ProductsModel');
const {upload,imgproductorder,deleteImage} = require('../model/uploadFile'); // Import the file upload module
const db = require('../config/db');
const { status } = require('express/lib/response');

// Lấy tất cả sản phẩm
const getAllProducts = (req, res) => {
    productModel.getAllProducts((err, products) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving products', error: err });
        }
        res.status(200).json(products);
    });
};
const getAllProductsNotStatus = (req, res) => {
    productModel.getAllProductsNoStatus((err, products) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving products', error: err });
        }
        res.status(200).json(products);
    });
};
// Lấy sản phẩm theo ID
const getProductById = (req, res) => {
    const productId = req.params.id;

    const query = `
        SELECT p.*, pi.OtherImages
        FROM product p
        LEFT JOIN productimage pi ON p.ProductID = pi.ProductID
        WHERE p.ProductID = ?
    `;

    db.query(query, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving product', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Extract product details and images
        const product = results[0];
        const otherImages = results.map(row => row.OtherImages).filter(image => image);

        // Combine product data with images
        const productData = {
            ...product,  // Spread the product details
            OtherImages: otherImages // Add an array of images
        };

        res.status(200).json(productData);
    });
};

const updateProduct = (req, res) => {
    const productId = req.params.id; // Giả định bạn đang truyền ID sản phẩm trong URL
    console.log(productId);
    console.log(req.body);

    // Xử lý việc tải lên các hình ảnh khác
    imgproductorder(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading images', error: err });
        }

        // Lấy danh sách các hình ảnh khác
        const otherImages = req.files.map(file => file.filename);

        // Tạo đối tượng cập nhật, chỉ bao gồm các trường được cung cấp
        const updatedProduct = {
            ProductID: productId,
            ProductName: req.body.ProductName,
            Description: req.body.Description,
            Price: req.body.Price,
            StockQuantity: req.body.StockQuantity,
            CategoryID: req.body.CategoryID,
            status: req.body.status,
            ShortDescription: req.body.ShortDescription,
        };

        // Cập nhật sản phẩm trong cơ sở dữ liệu
        productModel.updateProduct(updatedProduct, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating product', error: err });
            }

            // Xử lý xóa hình ảnh cũ nếu cần
            productModel.getOldImages(productId, (err, oldImages) => {
                if (err) {
                    console.error('Error fetching old images:', err);
                    return res.status(500).json({ message: 'Error fetching old images', error: err });
                }
                
                // Xóa các hình ảnh cũ từ hệ thống tệp
                const deletePromises = oldImages.map(image => {
                    return new Promise((resolve, reject) => {
                        deleteImage(image.OtherImages, (err) => {
                            if (err) {
                                console.error('Error deleting image:', err);
                                return reject(err); // Dừng việc xóa nếu có lỗi
                            }
                            resolve();
                        });
                    });
                });

                // Chờ tất cả các hình ảnh cũ được xóa
                Promise.all(deletePromises)
                    .then(() => {
                        // Xóa hình ảnh cũ khỏi cơ sở dữ liệu
                        return productModel.deleteOldImages(productId);
                    })
                    .then(() => {
                        // Lưu hình ảnh mới vào bảng productimage
                        const imageInsertPromises = otherImages.map(image => {
                            const imageData = {
                                ProductID: productId,
                                OtherImages: image,
                            };
                            return new Promise((resolve, reject) => {
                                productModel.productImageModel(imageData, (err, result) => {
                                    if (err) return reject(err);
                                    resolve(result);
                                });
                            });
                        });

                        // Chờ tất cả các hình ảnh mới được lưu
                        return Promise.all(imageInsertPromises);
                    })
                    .then(() => {
                        res.status(200).json({ message: 'Product updated successfully', productId });
                    })
                    .catch(err => {
                        console.error('Error saving product images:', err);
                        res.status(500).json({ message: 'Error saving product images', error: err });
                    });
            });
        });
    });
};


// Tạo sản phẩm mớiasdasd87878                                           
const createProduct = (req, res) => {
    // Handle the upload for OtherImages
    imgproductorder(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading other images', error: err });
        }

        // Get the list of other images
        const otherImages = req.files.map(file => file.filename);
        
        // Create new product object without MainImage
        const newProduct = {
            ProductName: req.body.ProductName,
            Description: req.body.Description,
            Price: req.body.Price,
            StockQuantity: req.body.StockQuantity,
            CategoryID: req.body.CategoryID,
            status: req.body.status,
            ShortDescription: req.body.ShortDescription,
            // MainImage: mainImage // Removed since you no longer handle the main image
        };

        // Save the product to the database
        productModel.createProduct(newProduct, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error creating product', error: err });
            }

            const productId = result.insertId;

            // Save other images into the productimage table
            const imageInsertPromises = otherImages.map(image => {
                const imageData = {
                    ProductID: productId,
                    OtherImages: image
                };
                return new Promise((resolve, reject) => {
                    productModel.productImageModel(imageData, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            });

            // Wait for all other images to be saved
            Promise.all(imageInsertPromises)
                .then(() => {
                    res.status(201).json({ message: 'Product created successfully', productId });
                })
                .catch((err) => {
                    console.error('Error saving product images:', err); // Log the actual error
                    res.status(500).json({ message: 'Error saving product images', error: err });
                });
                
        });
    });
};


// Xóa sản phẩm
const deleteProductById = (req, res) => {
    const productId = req.params.id;

    // Kiểm tra sản phẩm có đơn hàng liên quan hay không
    productModel.checkProductOrders(productId, (err, hasOrders) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking product orders', error: err });
        }

        // Nếu có đơn hàng, không cho phép xóa
        if (hasOrders) {
            return res.status(400).json({
                message: 'Product cannot be deleted because it is associated with an order',
                error: 'FOREIGN_KEY_CONSTRAINT',
            });
        }

        // Nếu không có đơn hàng, tiến hành xóa sản phẩm
        productModel.deleteProductById(productId, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting product', error: err });
            }

            res.status(200).json({ message: 'Product deleted successfully' });
        });
    });
};


// Cập nhật trạng thái sản phẩm
const updateProductStatus = (req, res) => {
    const {productId ,newStatus} = req.body;
    console.log(req.body);
    productModel.updateProductStatus(productId, newStatus, (err, result) => {
        if (err) {
            return res.status(500).json({status:false, message: 'Error updating product status', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({status:false, message: 'Product not found', error: err });
        }
        res.status(200).json({ status:true,message: 'Product status updated successfully' });
    });
};
const getProductsGetNew = (req,res)=>{
    console.log('trssst')
    productModel.getProductsNew((err, products) => {
        if (err) {
            return res.status(500).json({status:false, message: 'Error retrieving products', error: err });
        }
        return res.status(200).json({status:true, data: products });
    });
};
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProductById,
    updateProductStatus,
    getProductsGetNew,
    getAllProductsNotStatus,
    updateProduct
};
