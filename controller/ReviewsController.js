const { status } = require('express/lib/response');
const ReviewModel = require('../model/ReviewsModel');
const db = require('../config/db');

// Lấy tất cả reviews
const getAllReviews = (req, res) => {
  ReviewModel.getAllreview((err, reviews) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json(reviews);
  });
};

// Lấy review theo ID
const getReviewById = (req, res) => {
  const ReviewID = req.params.id;
  ReviewModel.getReviewById(ReviewID, (err, review) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json(review);
  });
};

// Thêm review mới
const createReview = (req, res) => {
  console.log(req.body);
  
  const newReview = {
    UserID: req.body.UserID,
    ProductID: req.body.ProductID,
    Rating: req.body.Rating,
    Comment: req.body.Comment,
    ReviewDate: new Date(), // Current date
  };

  const { UserID, ProductID } = newReview; // Extracting UserID and ProductID from newReview

  const checkOrderQuery = `
    SELECT oi.OrderID 
    FROM orderitem oi
    JOIN \`order\` o ON oi.OrderID = o.OrderID 
    WHERE o.UserID = ? AND oi.ProductID = ?;
  `;
  
  db.query(checkOrderQuery, [UserID, ProductID], (err, results) => {
    if (err) {
      return res.status(500).json({ status: false, error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ status: false, error: 'Bạn phải mua sản phẩm này trong đơn hàng đã chỉ định trước khi để lại đánh giá.' });
    }

    const existingReviewQuery = `
      SELECT * FROM review
      WHERE UserID = ? AND ProductID = ? LIMIT 1;
    `;
    
    db.query(existingReviewQuery, [UserID, ProductID], (err, reviewResults) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // Check if a review already exists
      if (reviewResults.length > 0) {
        return res.status(400).json({ status: false, error: 'Bạn đã đánh giá sản phẩm này rồi.' });
      }

      // If no existing review, create a new one
      ReviewModel.createReview(newReview, (err, insertId) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        res.status(201).json({ status: true, message: 'Review created successfully', ReviewID: insertId });
      });
    });
  });
};

// Cập nhật review
const updateReview = (req, res) => {
  const ReviewID = req.params.id;
  const updatedReview = {
    Rating: req.body.Rating,
    Comment: req.body.Comment
  };

  ReviewModel.updateReview(ReviewID, updatedReview, (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({status :true, message: 'Review updated successfully' });
  });
};

// Xóa review
const deleteReview = (req, res) => {
  const ReviewID = req.params.id;

  ReviewModel.deleteReview(ReviewID, (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json({status :true, message: 'Review deleted successfully' });
  });
};
const getReviewsByProductId = (req, res) => {
  const {ProductID} = req.body;
  console.log(req.body);
  ReviewModel.getReviewsByProductId(ProductID, (err, reviews) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json(reviews);
  });
};
// Xuất các hàm
module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByProductId
};
