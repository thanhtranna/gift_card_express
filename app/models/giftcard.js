'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
// const notify = require('../mailer');



const Schema = mongoose.Schema;

// const getTags = tags => tags.join(',');
// const setTags = tags => tags.split(',');

/**
 * GiftCard Schema
 */

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

/**
* Validations
*/

GiftCardSchema.path('maxPrice').required(true, 'Article title cannot be blank');
GiftCardSchema.path('minPrice').required(true, 'Article body cannot be blank');
// GiftCardSchema.path('expiresDate').required(true, 'Article body cannot be blank');


GiftCardSchema.methods = {


    saveGift: function () {
        return this.save();
    },
};

GiftCardSchema.statics = {

    /**
     * List GiftCard
     */

    list: function (options) {
        return this.find(options)
            .populate('User','Categories')
            .exec();

    },
    load: function (id){
        return this.findOne({ _id: id }).exec();
    }

};

module.exports = mongoose.model('GiftCard', GiftCardSchema);
