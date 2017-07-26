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
     * List categories
     */

    list: function (options) {
        return this.find(options).exec();
    },

    load: function (id){
        return this.findOne({ _id: id }).exec();
    }
};

mongoose.model('Categories', CategoriesSchema);
