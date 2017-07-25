/**
 * Created by tranthanhit on 24/07/2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
    order: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    giftcard: [
        {
            type: Schema.Types.ObjectId,
            ref: 'GiftCard'
        }
    ],
    name: {
        type: String
    },
    description: {
        type: String
    },
    parent: {
        type: Schema.Types.ObjectId
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: Date
}, { collection: 'Category' });

module.exports = mongoose.model('Category', CategorySchema);