const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const Transactions = mongoose.model('Transactions');

/**
 * Transaction
 */

exports.index = async(function*(req, res) {
    console.log('Transaction...');
    const options = {};
    const transactions = yield Transactions.list(options);
    console.log(transactions);
    respond(res, 'admin/transaction/transaction', {
        title: 'Transactions',
        transactions
    });
    // const order = yield Order.load(req.body.orderId);
    // const transaction = new Transactions();
    // // Set fields Transaction.
    // transaction.user = order.user;
    // transaction.description = 'Type: Order, User order: ' + order.user.name;
    // transaction.order = order;
    // /*  Set field bought = 1.
    //     0: Not sold yet
    //     1: Sold
    // */
    // order.bought = 1;
    // const giftcard = order.giftcard;
    // giftcard.status = 2;
    // try {
    //     // Save Order Collection, GiftCard Collection, Transaction Collection.
    //     if (transaction.saveTransactions() && order.saveOrder() && giftcard.saveGiftcard()) {
    //         respondOrRedirect({ req, res }, '/giftcards', transaction, {
    //             type: 'success',
    //             text: 'Successfully transaction order!'
    //         });
    //     }
    // } catch (err) {
    //     respond(res, '/giftcards', {
    //         title: 'New giftcard',
    //         errors: [err.toString()],
    //         transaction
    //     }, 422);
    // }
});