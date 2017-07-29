'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Order Schema
 */

const OrderSchema = new Schema({
    giftcard: { type: Schema.ObjectId, ref: 'GiftCards' },
    price: { type: String, default: '0', trim: true },
    user: { type: Schema.ObjectId, ref: 'User' },
    bought: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});


/**
 * Method
 * @type {}
 */
OrderSchema.methods = {

    /**
     * Save order
     *
     * @param {Object} images
     * @api private
     */

    saveOrder: function () {
        return this.save();
    },
};


OrderSchema.statics = {

    /**
     * List categories
     */

    list: function (options) {
        return this.find(options).populate([{ path: 'user', select: 'name username' }, { path: 'giftcard', select: '_id name description image status' }]).exec();
    },

    /**
     * Load category by id
     * @param id
     * @returns {Promise}
     */
    load: function (id){
        return this.findOne({ _id: id }).populate([{ path: 'user', select: 'name username' }, { path: 'giftcard', select: '_id name description image status' }]).exec();
    },

    listByUser: function (condition, arrIn) {
        return this.find()
            .populate([
                { path: 'user', select: 'name username' },
                { path: 'giftcard', select: '_id name description image status' }])
            .where(condition)
            .in(arrIn);
    }
};


mongoose.model('Order', OrderSchema);