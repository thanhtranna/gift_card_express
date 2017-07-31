'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Categories Schema
 */

const CategoriesSchema = new Schema({
    name: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    parent: { type: Schema.ObjectId, ref: 'Categories' },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

/**
 * Validations
 */

CategoriesSchema.path('name').required(true, 'Categories cannot be blank');


/**
 * Method
 * @type {}
 */
CategoriesSchema.methods = {

    /**
     * Save article and upload image
     *
     * @param {Object} images
     * @api private
     */

    saveCat: function () {
        // console.log(image);
        // code upload image
        return this.save();
    },
};

/**
 * Statics
 */

CategoriesSchema.statics = {

    /**
     * List categories bu options.
     */

    list: function (options) {
        return this.find(options).exec();
    },

    /**
     * Load category by id
     * @param id
     * @returns {Promise}
     */

    load: function (id){
        return this.findOne({ _id: id }).exec();
    },

    /**
     * Remove category by id.
     * @param id
     */

    remove: function (id) {
        return this.find({ _id: id }).remove().exec();
    }
};

mongoose.model('Categories', CategoriesSchema);
