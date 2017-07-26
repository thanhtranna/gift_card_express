'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Gift card Schema
 */

const GiftcardsSchema = new Schema({
    name: { type: String, default: '', trim: true },
    category: { type: Schema.ObjectId, ref: 'Categories' },
    image: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    userCreate: { type : Schema.ObjectId, ref : 'User' },
    maxPrice: { type: Number, default: 0, min: 0 },
    minPrice: { type: Number, default: 0, min: 0 },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now },
    status: { type: Number, default: 0, min: 0 },
    authGift: { type: Number, default: 0, min: 0 }
});

/**
 * Method
 * @type {{}}
 */

GiftcardsSchema.methods = {

};

/**
 * Statics
 */

GiftcardsSchema.statics = {
    /**
     * Get list gift card
     * @param options
     * @returns {Promise|Array|{index: number, input: string}|*}
     */
    list: function (options) {
        return this.find(options).exec();
    },

    /**
     * Get gift card by Id
     * @param id
     * @returns {Promise}
     */
    load: function (id){
        return this.findOne({ _id: id }).exec();
    }
};

mongoose.model('Giftcard', GiftcardsSchema);
