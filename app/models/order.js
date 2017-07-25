/**
 * Created by tranthanhit on 24/07/2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    giftcard: [
        {
            type: Schema.Types.ObjectId,
            ref: 'GiftCard'
        }
    ],
    transaction: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
    price: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
}, { collection: 'Order' });

module.exports = mongoose.model('Order', OrderSchema);