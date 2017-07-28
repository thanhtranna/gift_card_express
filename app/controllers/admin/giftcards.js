const mongoose = require('mongoose');
const { wrap: async } = require('co');
const path = require('path');
const pathName = path.join((process.cwd() + ' ').trim(), '/app/utils');
const { respond, respondOrRedirect  } = require(pathName);
const Giftcards = mongoose.model('Giftcard');
// const Categories = mongoose.model('Categories');


/**
 * List gift cards
 */
exports.index = async(function* (req, res) {
    const options = {
        // status: { $ne: 2 }
    };
    const giftcards = yield Giftcards.list(options);
    respond(res, 'admin/giftcards/index', {
        title: 'List Gift cards',
        giftcards: giftcards,
    });
});

/**
 * Auth gift card
 */
exports.authGift = async(function* (req, res) {
    const giftcard = yield Giftcards.load(req.param('giftId'));
    giftcard.status = 1;
    try {
        if (giftcard.saveGiftcard()) {
            const options = {};
            const giftcards = yield Giftcards.list(options);
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


