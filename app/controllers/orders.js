const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond, respondOrRedirect } = require('../utils');
const Order = mongoose.model('Orders');
const Giftcards = mongoose.model('GiftCards');

/**
 * Order
 */

exports.order = async(function (req, res) {
    const order = new Order();
    // Set fields order.
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

/**
 * Show index order.
 */

exports.index = async(function*(req, res) {
    const options = {
        user: req.user._id
    };
    const orders = yield Order.list(options);
    respond(res, 'orders/index', {
        title: 'List Orders',
        orders: orders,
    });
});

/**
 * Show information sell Order.
 */

exports.sellOrder = async(function*(req, res) {
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

/**
 *  Buy Order and render form.
 */

exports.buyOrder = async(function*(req, res) {
    const options = {
        user: req.user._id
    };
    const buyOrders = yield Order.list(options);
    respond(res, 'orders/sell_order', {
        title: 'List Buy Orders',
        buyOrders: buyOrders,
    });
});

/**
 * Clear order when user don't want buy giftcard.
 */

exports.clearOrder = async(function*(req, res) {
    const options = {
        _id: req.body.orderId
    };
    // Remove document order.
    if (yield Order.clearOrder(options)) {
        respondOrRedirect({ req, res }, '/orders/buy-order', {}, {
            type: 'success',
            text: 'Clear Order successfully!'
        });
    }
});