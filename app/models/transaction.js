/**
 * Created by tranthanhit on 24/07/2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 Schema
**/
const TransactionSchema = new mongoose.Schema({
    order: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    giftcard: [
        {
            type: Schema.Types.ObjectId,
            ref: 'GiftCards'
        }
    ],
    descriptions: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
}, { collection: 'Transaction' } );



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
    }

    // /**
    //  * Get gift card by Id
    //  * @param id
    //  * @returns {Promise}
    //  */
    // load: function (id){
    //     return this.findOne({ _id: id }).populate([{ path: 'user', select: 'name username' },
//                                                    { path: 'category', select: 'name' }])
    //     .exec();
    // }
};

module.exports = mongoose.model('Transaction', TransactionSchema);