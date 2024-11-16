var express = require('express');
var router = express.Router();
const categoryController = require('../controller/CategoriesController');
const productsController = require('../controller/ProductsController');
const userController = require('../controller/UserController');
const VoucherController = require('../controller/VoucherController');
const ReviewsController = require('../controller/ReviewsController');
const provinceController = require('../controller/ProvinceController');
const districtController = require('../controller/DistrictController');
const wardsController = require('../controller/WardsController');
const addressController = require('../controller/AddressController');
const OrdersController = require('../controller/OrdersController');
const BankController = require('../controller/BankController');
const checkAdmin = require('../Middleware/checkAdmin'); // Nhập middleware

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/getall-category', categoryController.getAllCategories); // Lấy tất cả categories
router.get('/get-category/:id', categoryController.getCategoryById); // Lấy category theo ID
router.post('/create-category',  categoryController.createCategory); // Tạo mới category (admin)
router.post('/update-category/:id', categoryController.updateCategory); // Cập nhật category theo ID (admin)
router.post('/delete-category', categoryController.deleteCategory); // Xóa category theo ID (admin)
router.get('/products/get-category', categoryController.getCategoriesWithProducts); // Lấy categories kèm sản phẩm

// Sản phẩm
router.get('/products', productsController.getAllProducts);
router.get('/products-notstatus', productsController.getAllProductsNotStatus);
router.get('/products/new', productsController.getProductsGetNew);
router.get('/products/:id', productsController.getProductById);
router.post('/products/creates', productsController.createProduct); // Tạo sản phẩm mới (admin)
router.post('/products/delete',  productsController.deleteProductById); // Xóa sản phẩm theo ID (admin)
router.post('/products/update/:id', productsController.updateProduct); // Cập nhật sản phẩm theo ID (admin)
router.post('/products/update-status',  productsController.updateProductStatus); // Cập nhật trạng thái sản phẩm (admin)

// Người dùng
router.get('/user/get-count', userController.gettonguser); // Lấy số lượng người dùng
router.get('/user', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.post('/user', userController.createUser);
router.post('/user/login', userController.loginUser);
router.post('/user/updates', userController.updateUsers);
router.post('/user/update/:id', userController.updateUser); // Cập nhật người dùng (admin)
router.post('/user/checkdatauser', userController.checkDataUser);
router.post('/user/forgot-password', userController.sendPassword);
router.post('/user/reset-password', userController.resetPassword);
router.post('/user/check-password', userController.checkToken);
router.post('/user/update-status/:id', userController.updateUserStatus); // Cập nhật trạng thái người dùng (admin)

// Voucher
router.get('/vouchers', VoucherController.getAllVouchers);
router.get('/vouchers/:id', VoucherController.getVoucherById);
router.post('/vouchers', checkAdmin, VoucherController.createVoucher); // Tạo voucher (admin)
router.post('/vouchers/update/:id', checkAdmin, VoucherController.updateVoucher); // Cập nhật voucher (admin)
router.post('/vouchers/getvoucher', VoucherController.getVoucherByCode);
router.get('/vouchers/delete/:id', checkAdmin, VoucherController.deleteVoucher); // Xóa voucher (admin)

// Đánh giá
router.get('/review', ReviewsController.getAllReviews);
router.get('/review/:id', ReviewsController.getReviewById); 
router.post('/review/add', ReviewsController.createReview); // Thêm review mới
router.post('/review/byproduct', ReviewsController.getReviewsByProductId); // Thêm review mới
router.post('/review/update/:id', ReviewsController.updateReview); // Cập nhật review theo ID (admin)

// Địa điểm
router.get('/location/province', provinceController.getAllProvince);
router.get('/location/district', districtController.getDistrictModelById);
router.get('/location/wards', wardsController.getWardsByID);

// Địa chỉ
router.get('/address', addressController.getAllAddresses);
router.get('/address/getid', addressController.getAddressByid);
router.post('/address/add', addressController.addAddress);
router.get('/address/update', addressController.updateAddress);
router.post('/address/byuser', addressController.getAddressByUserId);
router.get('/address/delete', addressController.deleteAddress);

// Đơn hàng
router.post('/order/creater', OrdersController.createOrder);
router.get('/order', OrdersController.getAllOrders);
router.post('/order/byuser', OrdersController.getOrdersByUserId);
router.post('/order/search', OrdersController.searchOrders);
router.get('/order/get-total-orders', OrdersController.getTotalOrders);
router.get('/order/get-sum-moth', OrdersController.getOrdersSummary);
router.post('/order/update', OrdersController.updateOrderStatus); // Cập nhật trạng thái đơn hàng (admin)
router.get('/orderdetail/get', OrdersController.getOrderItemsByOrderId);

// Ngân hàng
router.get('/bank', BankController.getAllAccounts); // Lấy tất cả tài khoản
router.get('/bank/:id', BankController.getAccountById); // Lấy tài khoản theo ID
router.post('/bank/add', checkAdmin, BankController.addAccount); // Thêm tài khoản mới (admin)
router.post('/bank/update/:id', checkAdmin, BankController.updateAccount); // Cập nhật tài khoản (admin)
router.post('/bank/delete/:id', checkAdmin, BankController.deleteAccount); // Xóa tài khoản (admin)

// Endpoint mới: Trả về toàn bộ dữ liệu
router.get('/all-data', async (req, res) => {
  try {
    const results = await Promise.all([
      new Promise((resolve, reject) => {
        categoryController.getAllCategories(req, res, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }), // Lấy danh mục
      new Promise((resolve, reject) => {
        productsController.getAllProducts(req, res, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }), // Lấy sản phẩm
      new Promise((resolve, reject) => {
        userController.getAllUsers(req, res, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }), // Lấy người dùng
      new Promise((resolve, reject) => {
        VoucherController.getAllVouchers(req, res, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }), // Lấy voucher
      new Promise((resolve, reject) => {
        ReviewsController.getAllReviews(req, res, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }), // Lấy đánh giá
      new Promise((resolve, reject) => {
        provinceController.getAllProvince(req, res, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }), // Lấy tỉnh
      new Promise((resolve, reject) => {
        addressController.getAllAddresses(req, res, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }), // Lấy địa chỉ
      new Promise((resolve, reject) => {
        OrdersController.getAllOrders(req, res, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }), // Lấy đơn hàng
      new Promise((resolve, reject) => {
        BankController.getAllAccounts(req, res, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }), // Lấy tài khoản ngân hàng
    ]);

    // Sau khi tất cả Promise hoàn thành, gửi dữ liệu cho client
    res.json({
      categories: results[0],
      products: results[1],
      users: results[2],
      vouchers: results[3],
      reviews: results[4],
      provinces: results[5],
      address: results[6],
      orders: results[7],
      banks: results[8],
    });
  } catch (error) {
    console.error('Lỗi khi lấy tất cả dữ liệu:', error);
    res.status(500).json({ error: 'Lỗi khi lấy tất cả dữ liệu' });
  }
});



module.exports = router;
