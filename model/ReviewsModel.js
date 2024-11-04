const db = require('../config/db'); // Giả sử bạn đã có file kết nối với MySQL

const reviewModel = {
  getAllreview: (callback) => {
     // Giả sử 'users' là tên bảng người dùng và 'UserID' là khóa ngoại trong bảng 'review'
     const query = `
     SELECT r.*, u.Username AS UserName 
     FROM review r
     JOIN user u ON r.UserID = u.UserID
   `;
   
   db.query(query, callback);
 },
 
  getReviewById: (id, callback) => {
    db.query('SELECT * FROM review WHERE ReviewID = ?', [id], callback);
  },

  createReview: (newReview, callback) => {
    db.query('INSERT INTO review SET ?', newReview, callback);
  },

  updateReview: (id, updatedReview, callback) => {
    db.query('UPDATE review SET ? WHERE ReviewID = ?', [updatedReview, id], callback);
  },

  deleteReview: (id, callback) => {
    db.query('DELETE FROM review WHERE ReviewID = ?', [id], callback);
  },
  getReviewsByProductId: (ProductID, callback) => {
    const query = `
      SELECT review.*, user.Username 
      FROM review 
      JOIN user ON review.UserID = user.UserID 
      WHERE review.ProductID = ?
    `;
    db.query(query, [ProductID], callback);
  }
};

module.exports = reviewModel;
