/**
 * Created by tranthanhit on 24/07/2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 Schema
 **/
const TransactionSchema = new Schema({
    order: { type: Schema.ObjectId, ref: 'Order' },
    giftcard: { type: Schema.ObjectId, ref: 'GiftCards' },
    user: { type: Schema.ObjectId, ref: 'User' },
    description: { type: String, default: '', trim: true },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

/**
 * Method
 * @type {{}}
 */

TransactionSchema.methods = {
    saveTransactions: function () {
        return this.save();
    },
};

/**
 * Statics
 */

TransactionSchema.statics = {
    /**
     * Get list transaction
     * @param options
     * @returns {Promise|Array|{index: number, input: string}|*}
     */
    list: function (options) {
        return this.find(options).populate([{ path: 'user', select: 'name' },
            { path: 'order', select: 'user price' },
            { path: 'giftcard', select: 'name category' }]).exec();
    },

};

module.exports = mongoose.model('Transaction', TransactionSchema);