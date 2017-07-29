const mongoose = require('mongoose');
const { wrap: async } = require('co');
const path = require('path');
const pathName = path.join((process.cwd() + ' ').trim(), '/app/utils');
<<<<<<< HEAD
const { respond, respondOrRedirect } = require(pathName);
const GiftCards = mongoose.model('GiftCards');
// const Categories = mongoose.model('Categories');
=======
const { respond, respondOrRedirect  } = require(pathName);
const GiftCards = mongoose.model('GiftCards');
>>>>>>> 7125c47a673cd7f191cdb152095e7cb9ce374f12


/**
 * List gift cards
 */

exports.index = async(function*(req, res) {
    const options = {
        // status: { $ne: 2 }
    };
    const giftcards = yield GiftCards.list(options);
    respond(res, 'admin/giftcards/index', {
        title: 'List Gift cards',
        giftcards: giftcards,
    });
});

/**
 * Auth gift card
 */
<<<<<<< HEAD

exports.authGift = async(function*(req, res) {
=======
exports.authGift = async(function* (req, res) {
>>>>>>> 7125c47a673cd7f191cdb152095e7cb9ce374f12
    const giftcard = yield GiftCards.load(req.param('giftId'));
    giftcard.status = 1;
    try {
        if (giftcard.saveGiftcard()) {
            const options = {};
            const giftcards = yield GiftCards.list(options);
            respondOrRedirect({ req, res }, '/admin/giftcards', giftcards, {
                type: 'success',
                text: 'Successfully authenticate giftcard!'
            });
        }
    } catch (err) {
        respond(res, 'admin/giftcards', {
            title: 'Cannot authenticate giftcard',
            errors: [err.toString()],
            giftcard
        }, 422);
    }
});


