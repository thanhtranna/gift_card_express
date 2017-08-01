const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond, respondOrRedirect } = require('../utils');
const GiftCards = mongoose.model('GiftCards');
const Categories = mongoose.model('Categories');
const Order = mongoose.model('Orders');

/**
 * List all gift cards
 */

exports.index = async(function*(req, res) {
    console.log('Req User: ', req.user);
    // List giftcards with status = 1 and without giftcard of current user.
    const options = {
        status: 1,
        user: { $ne: req.user }
    };
    const giftcards = yield GiftCards.list(options);
    respond(res, 'giftcards/index', {
        title: 'List Gift cards',
        giftcards: giftcards
    });
});

/**
 * List gift cards by user
 */

exports.giftcardByUser = async(function*(req, res) {
    const options = {
        user: req.user
    };
    const giftcards = yield GiftCards.list(options);
    respond(res, 'giftcards/list_gift_by_user', {
        title: 'List Gift cards',
        giftcards: giftcards,
    });
});

/**
 * New gift card
 */

exports.new = async(function*(req, res) {
    const options = {};
    const categories = yield Categories.list(options);
    console.log('Categories: ', categories);
    respond(res, 'giftcards/new', {
        title: 'Create Gift card',
        categories: categories,
        giftcard: new GiftCards()
    });
});

/**
 * Create gift card
 */

exports.create = async(function*(req, res) {
    console.log('Create gift card:----------------------');
    // Set field giftcard.
    const giftcard = new GiftCards();
    giftcard.name = req.body.name;
    giftcard.category = req.body.category;
    giftcard.image = req.body.image;
    giftcard.description = req.body.description;
    giftcard.user = req.user;
    giftcard.maxPrice = req.body.maxPrice;
    giftcard.minPrice = req.body.minPrice;
    giftcard.expiresAt = req.body.expiresAt;
    // console.log('Gift Card: ', giftcard);
    // console.log('File upload: ',req.file);
    // console.log('Path upload file: ', path.join((process.cwd() + ' ').trim(), '/uploads'));

    try {
        if (giftcard.saveGiftcard()) {
            const options = {};
            // Lisft giftcards.
            const giftcards = yield GiftCards.list(options);
            respondOrRedirect({ req, res }, '/giftcards', giftcards, {
                type: 'success',
                text: 'Successfully created giftcard!'
            });
        }
    } catch (err) {
        respond(res, 'giftcards/new', {
            title: 'New giftcard',
            errors: [err.toString()],
            giftcard
        }, 422);
    }
});

/**
 * Show detail gift card
 */

exports.show = async(function*(req, res) {
    const giftcard = yield GiftCards.load(req.param('giftId'));
    const options = {
        giftcard: giftcard._id
    };

    const giftcardOrders = yield Order.list(options);
    console.log(giftcardOrders);
    respond(res, 'giftcards/show', {
        title: 'Show gift card detail',
        giftcard: giftcard,
        giftcardOrders: giftcardOrders
    });
});

/**
 * Edit gift card
 */

exports.edit = async(function*(req, res) {
    console.log('Edit gift card:----------------------');
    const giftcard = yield GiftCards.load(req.param('giftId'));
    const options = {
        // parent: null
    };
    const categories = yield Categories.list(options);
    console.log('Category: ', categories);
    respond(res, 'giftcards/edit', {
        title: 'Edit ' + giftcard.name,
        giftcard: giftcard,
        categories: categories
    });
});

/**
 * Update gift card
 */

exports.update = async(function*(req, res) {
    console.log('Update gift card:---------------');
    const giftcard = yield GiftCards.load(req.param('giftId'));
    giftcard.name = req.body.name;
    giftcard.category = req.body.category;
    // giftcard.image = req.body.image;
    giftcard.description = req.body.description;
    giftcard.maxPrice = req.body.maxPrice;
    giftcard.minPrice = req.body.minPrice;
    giftcard.expiresAt = (null == req.body.expiresAt) ? Date.now : req.body.expiresAt;
    console.log('expiressssssssssss: ' + giftcard.expiresAt);

    try {
        if (giftcard.saveGiftcard()) {
            console.log('Dang luu gift card!!');
            const options = {};
            const giftcards = yield GiftCards.list(options);
            respondOrRedirect({ req, res }, '/giftcards', giftcards, {
                type: 'success',
                text: 'Successfully update giftcard!'
            });
        } else {
            console.log('Co loi xay ra.');
        }
    } catch (err) {
        console.log('Co loi xay ra');
        respond(res, 'giftcards/new', {
            title: 'New giftcard',
            errors: [err.toString()],
            giftcard
        }, 422);
    }
});

/**
 * Delete gift card
 */

exports.destroy = async(function*(req, res) {
    const giftcard = yield GiftCards.load(req.param('giftId'));
    giftcard.remove();
    respondOrRedirect({ req, res }, '/giftcards', {}, {
        type: 'info',
        text: 'Deleted successfully'
    });
});

/**
 * Sell gift card
 */

exports.sell = async(function*(req, res) {
    const giftcard = yield GiftCards.load(req.param('giftId'));
    giftcard.status == 0 ? giftcard.status = 1 : giftcard.status = 0;

    try {
        if (giftcard.saveGiftcard()) {
            respondOrRedirect({ req, res }, '/giftcards', giftcard, {
                type: 'success',
                text: 'Change status successfully!'
            });
        }
    } catch (err) {
        respond(res, 'giftcards', {
            title: 'Error Change giftcard',
            errors: [err.toString()],
            giftcard
        }, 422);
    }
});

/**
 * Buy gift card
 */
exports.confirmBuy = async(function*(req, res) {
    const giftcard = yield GiftCards.load(req.body.giftId);
    respond(res, 'orders/confirm', {
        title: 'Confirm orders gift card',
        price: req.body.price,
        giftcard: giftcard
    });
});
