const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond , respondOrRedirect } = require('../utils');
const Transactions = mongoose.model('Transaction');
const Order = mongoose.model('Order');

/**
 * Transaction
 */
exports.transaction = async(function* (req, res) {
    const order = yield Order.load(req.body.orderId);
    const transaction = new Transactions();
    transaction.user = order.user;
    transaction.description = 'Type: Order, User order: ' + order.user.name;
    transaction.order = order;
    order.bought = 1;
    const giftcard = order.giftcard;
    giftcard.status = 2;
    try {
        if (transaction.saveTransactions() && order.saveOrder() && giftcard.saveGiftcard()) {
            respondOrRedirect({ req, res }, '/giftcards', transaction, {
                type: 'success',
                text: 'Successfully transaction order!'
            });
        }
    } catch (err) {
        respond(res, '/giftcards', {
            title: 'New giftcard',
            errors: [err.toString()],
            transaction
        }, 422);
    }
});