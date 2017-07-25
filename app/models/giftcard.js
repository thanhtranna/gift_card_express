/**
 * Created by tranthanhit on 24/07/2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiftCardSchema = new mongoose.Schema({
    transaction: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    order: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    descriptions: {
        type: String
    },
    image: {
        type: String
    },
    maxPrice: {
        type: Number
    },
    minPrice: {
        type: Number
    },
    expiresDate: {
        type: Date
    },
    status: {
        type: Number
    },
    authGift: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
}, { collection: 'GiftCard' });

module.exports = mongoose.model('GiftCard', GiftCardSchema);