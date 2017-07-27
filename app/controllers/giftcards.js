const mongoose = require('mongoose');
const { wrap: async } = require('co');
const path = require('path');
const multer = require('multer');
const { storage } = require('../../config/uploadFile');
const { respond, respondOrRedirect } = require('../utils');
const GiftCards = mongoose.model('GiftCards');
const Categories = mongoose.model('Categories');

/**
 * List gift cards
 */
exports.index = async(function*(req, res) {
    const options = {};
    const giftcards = yield GiftCards.list(options);
    respond(res, 'giftcards/index', {
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
    console.log('Create gift card:=----------------------');
    const giftcard = new GiftCards();
    giftcard.name = req.body.name;
    // console.log('Req body Gift Card: ',req.body);
    giftcard.category = req.body.category;
    giftcard.image = req.body.image;
    giftcard.description = req.body.description;
    giftcard.user = req.user;
    giftcard.maxPrice = req.body.maxPrice;
    giftcard.minPrice = req.body.minPrice;
    giftcard.expiresAt = req.body.expiresAt;
    console.log('Gift Card: ', giftcard);
    console.log('Path upload file: ',path.join((process.cwd() + ' ').trim(), '/uploads'));

    try {
        if (giftcard.saveGiftcard()) {
            const options = {};
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
    console.log('Show gift card:=----------------------');
    const giftcard = yield GiftCards.load(req.param('giftId'));
    respond(res, 'giftcards/show', {
        title: 'Show gift card detail',
        giftcard: giftcard
    });
});

/**
 * Edit gift card
 */

exports.edit = async(function*(req, res) {
    console.log('Edit gift card:=----------------------');
    const giftcard = yield GiftCards.load(req.param('giftId'));
    const options = {
        parent: null
    };
    const categories = yield Categories.list(options);
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
    console.log('Update gift card:=---------------');
    const giftcard = yield GiftCards.load(req.param('giftId'));
    giftcard.name = req.body.name;
    giftcard.category = req.body.category;
    giftcard.image = req.body.image;
    giftcard.description = req.body.description;
    giftcard.maxPrice = req.body.maxPrice;
    giftcard.minPrice = req.body.minPrice;
    giftcard.expiresAt = (null == req.body.expiresAt) ? Date.now : req.body.expiresAt;
    console.log('------------------------------------------------------------');
    console.log('Path upload file: ',path.join((process.cwd() + ' ').trim(), '/uploads'));

    try {
        var upload = multer({
            storage: storage,
            fileFilter: function (req, file, callback) {
                var ext = path.extname(file.originalname);
                if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                    return callback(res.end('Only images are allowed'), null);
                }
                callback(null, true);
            }
        }).single('image');

        const options = {};
        const giftcards = yield GiftCards.list(options);

        upload(req, res, (err) => {
            if (err) {
                console.log('Co loi xay ra render lai trang listgift');
                respondOrRedirect({ req, res }, '/giftcards', giftcards, {
                    type: 'error',
                    text: 'Upload image failed!!'
                });
            } else {
                console.log('Upload successfully!!');
                if (giftcard.saveGiftcard()) {
                    console.log('Dang luu gift card!!');
                    // const options = {};
                    // const giftcards = yield GiftCards.list(options);
                    respondOrRedirect({ req, res }, '/giftcards', giftcards, {
                        type: 'success',
                        text: 'Successfully update giftcard!'
                    });
                } else {
                    console.log('Co loi xay ra.');
                }
            }
        });
    } catch (err) {
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
    const giftcard = yield Giftcards.load(req.param('giftId'));
    giftcard.remove();
    respondOrRedirect({ req, res }, '/giftcards', {}, {
        type: 'info',
        text: 'Deleted successfully'
    });
});

