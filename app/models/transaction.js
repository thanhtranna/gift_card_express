/**
 * Created by tranthanhit on 24/07/2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
            ref: "GiftCard"
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
}, {collection: "Transaction"});

module.exports = mongoose.model('Transaction', TransactionSchema);