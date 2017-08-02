'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Order Schema
 */

const OrdersSchema = new Schema({
    giftcard: { type: Schema.ObjectId, ref: 'GiftCards' },
    price: { type: String, default: '0', trim: true },
    userSell: { type: Schema.ObjectId, ref: 'Users' },
    user: { type: Schema.ObjectId, ref: 'Users' },
    bought: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});


/**
 * Method
 * @type {}
 */
OrdersSchema.methods = {

    /**
     * Save order
     * @param {Object} images
     * @api private
     */

    saveOrder: function () {
        return this.save();
    },
};


OrdersSchema.statics = {

    /**
     * List orders
     */

    list: function (options) {
        return this.find(options).populate([{ path: 'user', select: '_id name username' }, {
            path: 'giftcard',
            select: '_id name description image status'
        }]).exec();
    },

    /**
     * Clear Order.
     * @param options
     * @returns {Promise}
     */
    clearOrder: function (options) {
        return this.find(options).remove().exec();
    },

    /**
     * Load order by id
     * @param id
     * @returns {Promise}
     */
    load: function (id) {
        return this.findOne({ _id: id }).populate([{ path: 'user', select: 'name username' }, {
            path: 'giftcard',
            select: '_id name description image status'
        }]).exec();
    },

    /**
     * list by user where condition.
     * @param condition
     * @param arrIn
     * @returns {*}
     */
    listByUser: function (condition, arrIn) {
        return this.find()
            .populate([
                { path: 'user', select: 'name username' },
                { path: 'giftcard', select: '_id name description image status' }])
            // .where('giftcard.status').in(['1', '2'])
            .where(condition)
            .in(arrIn);
    }
};


mongoose.model('Orders', OrdersSchema);