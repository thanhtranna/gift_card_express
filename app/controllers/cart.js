/**
 * Created by tranthanhit on 28/07/2017.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');

const GiftCards = mongoose.model('GiftCards');
const Cart = require('../models/cart');
const { respond, respondOrRedirect } = require('../utils');

/**
 * Add to cart.
 * @param req
 * @param res
 */

exports.add = async(function*(req, res) {
    const idCart = req.params.idCart;
    console.log('ID Cart: ', idCart);
    console.log('Req User: ', req.user);
    // Cart from session.
    var cart = new Cart(req.user.cart ? req.user.cart : {});
    try {
        const options = {
            _id: idCart
        };
        const giftcard = yield GiftCards.findById(options);

        // Add to cart.
        console.log('123123123');
        cart.add(giftcard, giftcard._id);
        req.user.cart = cart;
        delete req.user.cart.add;
        delete req.user.cart.reduceByOne;
        delete req.user.cart.removeItem;
        delete req.user.cart.generateArray;
        console.log('Cart from session: ',req.user.cart.totalQty);
        respondOrRedirect({ req, res }, '/', cart, {
            type: 'success',
            text: 'Add giftcart successfully!!'
        });
    } catch (err) {
        respondOrRedirect({ req, res }, '/', cart, {
            type: 'errors',
            text: 'Not add to shopping cart!!'
        });
    }
});