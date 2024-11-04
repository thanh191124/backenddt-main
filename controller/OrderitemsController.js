// controllers/OrderItemController.js
const orderItemModel = require('../model/OrderItemModel');

// Lấy tất cả order items
const getAllOrderItems = (req, res) => {
    orderItemModel.getAllOrderItems((err, orderItems) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching order items', error: err });
        }
        res.json(orderItems);
    });
};

// Lấy order item theo ID
const getOrderItemById = (req, res) => {
    const orderItemId = req.params.id;
    orderItemModel.getOrderItemById(orderItemId, (err, orderItem) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching order item', error: err });
        }
        res.json(orderItem);
    });
};

// Tạo mới order item
const createOrderItem = (req, res) => {
    const orderItemData = req.body;
    orderItemModel.createOrderItem(orderItemData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating order item', error: err });
        }
        res.status(201).json({ message: 'Order item created', orderItemId: result.insertId });
    });
};

// Cập nhật order item theo ID
const updateOrderItem = (req, res) => {
    const orderItemId = req.params.id;
    const orderItemData = req.body;
    orderItemModel.updateOrderItem(orderItemId, orderItemData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating order item', error: err });
        }
        res.json({ message: 'Order item updated successfully' });
    });
};

// Xóa order item theo ID
const deleteOrderItem = (req, res) => {
    const orderItemId = req.params.id;
    orderItemModel.deleteOrderItem(orderItemId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting order item', error: err });
        }
        res.json({ message: 'Order item deleted successfully' });
    });
};

module.exports = {
    getAllOrderItems,
    getOrderItemById,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem
};
