const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const Giftcards = mongoose.model('Giftcard');
const Categories = mongoose.model('Categories');

/**
 * List gift cards
 */
exports.index = async(function* (req, res) {
    const options = {};
    const giftcards = yield Giftcards.list(options);
    respond(res, 'giftcards/index', {
        title: 'List Gift cards',
        categories: giftcards,
    });
});

/**
 * New gift card
 */

exports.new = async(function* (req, res) {
    const options = {};
    const categories = yield Categories.list(options);
    respond(res, 'giftcards/new', {
        title: 'Create Gift card',
        categories: categories,
        giftcard: new Giftcards()
    });
});