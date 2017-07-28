'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Gift card Schema
 */

const GiftCardsSchema = new Schema({
    name: { type: String, default: '', trim: true },
    category: { type: Schema.ObjectId, ref: 'Categories' },
    image: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    user: { type : Schema.ObjectId, ref : 'User' },
    maxPrice: { type: Number, default: 0, min: 0 },
    minPrice: { type: Number, default: 0, min: 0 },
    expiresAt: { type: Date, default: Date.now },
    status: { type: Number, default: 0 },
    authGift: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

/**
 * Method
 * @type {{}}
 */

GiftCardsSchema.methods = {
    saveGiftcard: function () {
        // code upload image
        return this.save();
    }
};

/**
 * Statics
 */

GiftCardsSchema.statics = {
    /**
     * Get list gift card
     * @param options
     * @returns {Promise|Array|{index: number, input: string}|*}
     */
    list: function (options) {
        return this.find(options).populate([{ path: 'user', select: 'name username' }, { path: 'category', select: 'name' }])
                    .exec();
    },

    /**
     * Get gift card by Id
     * @param id
     * @returns {Promise}
     */
    load: function (id){
        return this.findOne({ _id: id }).populate('user', 'name username').exec();
    },

    /**
     * Get list Id gift cart by Id user
     * @param id
     */
    listIdGiftcardByUser: function (options) {
        return this.findOne({ _id: id }).populate([{ path: 'user', select: 'name username' }, { path: 'category', select: 'name' }]).exec();
    }
};

mongoose.model('GiftCards', GiftCardsSchema);
