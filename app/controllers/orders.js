const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond , respondOrRedirect } = require('../utils');
const Order = mongoose.model('Order');
const Giftcards = mongoose.model('GiftCards');

/**
 * Order
 */
exports.order = async(function (req, res) {
    const order = new Order();
    order.giftcard = req.body.giftId;
    order.price = req.body.price;
    order.user = req.user;
    try {
        if (order.saveOrder()) {
            respondOrRedirect({ req, res }, '/orders/list', order, {
                type: 'success',
                text: 'Order successfully!'
            });
        }
    } catch (err) {
        respond(res, '/giftcards/confirm-buy', {
            title: 'Order failed!',
            errors: [err.toString()],
            order
        }, 422);
    }
});

exports.index = async(function* (req, res) {
    const options = {
        user: req.user._id
    };
    const orders = yield Order.list(options);
    respond(res, 'orders/index', {
        title: 'List Orders',
        orders: orders,
    });
});


exports.sellOrder = async(function* (req, res) {
    const options = {
        user: req.user._id
    };
    const giftcards = yield Giftcards.listIdGiftcardByUser(options);
    console.log('Get list id by user: ', giftcards);
    const sellOrders = yield Order.listByUser('giftcard', giftcards);
    console.log(sellOrders);
    respond(res, 'orders/sell_order', {
        title: 'List Sell Orders',
        sellOrders: sellOrders,
    });
});


exports.buyOrder = async(function* (req, res) {
    const options = {
        user: req.user._id
    };
    const buyOrder = yield Order.list(options);
    respond(res, 'orders/sell_order', {
        title: 'List Buy Orders',
        sellOrders: buyOrder,
    });
});
