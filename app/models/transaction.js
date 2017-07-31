/**
 * Created by tranthanhit on 24/07/2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 Schema
 **/

const TransactionsSchema = new Schema({
    order: { type: Schema.ObjectId, ref: 'Orders' },
    giftcard: { type: Schema.ObjectId, ref: 'GiftCards' },
    user: { type: Schema.ObjectId, ref: 'Users' },
    description: { type: String, default: '', trim: true },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

/**
 * Method
 * @type {{}}
 */

TransactionsSchema.methods = {
    /**
     * Save transaction.
     */

    saveTransactions: function () {
        return this.save();
    },
};

/**
 * Statics
 */

TransactionsSchema.statics = {

    /**
     * Get list transaction
     * @param options
     * @returns {Promise|Array|{index: number, input: string}|*}
     */

    list: function (options) {
        return this.find(options).populate([{ path: 'user', select: 'name' },
            { path: 'order', select: 'user price' },
            { path: 'giftcard', select: 'name category' }]).exec();
    }
};

module.exports = mongoose.model('Transactions', TransactionsSchema);