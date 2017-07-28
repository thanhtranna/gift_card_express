
const mongoose = require('mongoose');
const { wrap: async } = require('co');
// const { respond , respondOrRedirect } = require('../../utils');
const Transaction = mongoose.model('Transaction');

/**
 * List Transaction
 */
exports.transaction = async(function* (req, res) {
    const options = {};
    const transactions = yield Transaction.list(options);
    console.log(transactions);
    res.render('admin/transaction/transaction', {
        title: 'Transaction',
        transactions: transactions
    });
});
