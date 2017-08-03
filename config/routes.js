'use strict';

/*
 * Module dependencies.
 */

const csrf = require('csurf');
const flash = require('express-flash');
const multer = require('multer');
const path = require('path');

/**
 *  Require file.
 */

const adminUser = require('../app/controllers/admin/index');
const users = require('../app/controllers/users');
const articles = require('../app/controllers/articles');
const orders = require('../app/controllers/orders');
const categories = require('../app/controllers/admin/categories');
const giftcards = require('../app/controllers/giftcards');
const index = require('../app/controllers/index');
const cart = require('../app/controllers/cart');
const giftCardsAdmin = require('../app/controllers/admin/giftcards');
const transactionsAdmin = require('../app/controllers/admin/transactions');
const transactions = require('../app/controllers/transactions');
const comments = require('../app/controllers/comments');
const tags = require('../app/controllers/tags');
const auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];
const adminAuth = [auth.requiresLogin, auth.admin.hasAuthorization];
const giftCardAuth = [auth.requiresLogin, auth.giftcard.hasAuthorization];
const editGiftCardAuth = [auth.requiresLogin, auth.giftcard.hasAuthorization, auth.giftcard.editGiftcard];

const fail = {
    failureRedirect: '/login'
};

// Code upload file.

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join((process.cwd() + ' ').trim(), '/uploads/'));
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback('Only images are allowed', null);
            }
            callback(null, true);
        }
    });

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    const pauth = passport.authenticate.bind(passport);

    // admin routes

    app.get('/admin', adminAuth, adminUser.index);
    app.get('/admin/users', adminAuth, adminUser.users);
    app.get('/admin/user/edit/:userId', adminAuth, adminUser.editUserById);
    app.get('/admin/user/profile', adminAuth, adminUser.profileAdmin);
    app.post('/admin/user/profile', adminAuth, adminUser.updateAdminById);
    app.post('/admin/user/edit/:userId', adminAuth, adminUser.updateUserById);
    app.post('/admin/user/delete', adminAuth, adminUser.deleteUserById);
    app.get('/admin/listgift', adminAuth, adminUser.listgift);
    app.get('/admin/listgift/:giftId', adminAuth, adminUser.show);
    app.get('/admin/transaction', adminAuth, transactionsAdmin.index);

    // category routes. admin permission.
    app.get('/admin/categories/', adminAuth, categories.index);
    app.get('/admin/categories/new', adminAuth, categories.new);
    app.post('/admin/categories', adminAuth,  upload.single('image'), categories.create);
    app.get('/admin/categories/:catId', adminAuth, categories.show);
    app.get('/admin/categories/:catId/edit', adminAuth, categories.edit);
    app.put('/admin/categories/:catId', adminAuth, categories.update);
    app.delete('/admin/categories/:catId', adminAuth, categories.destroy);

    // Router authenticate gift card.
    app.get('/admin/giftcards/:giftId/auth_gift', adminAuth, giftCardsAdmin.authGift);
    app.get('/admin/giftcards', adminAuth, giftCardsAdmin.index);
    app.get('/admin/giftcards/:giftId', adminAuth, giftCardsAdmin.show);
    app.put('/admin/giftcards/:giftId/auth_gift', adminAuth, giftCardsAdmin.authGift);
    app.delete('/admin/giftcards/:giftId', adminAuth, giftCardsAdmin.deleteGift);
    // Router admin transaction.
    // app.get('/admin/transaction', adminAuth, transactionsAdmin.index);

    // router shopping cart.
    app.get('/add-to-cart/:idCart', auth.requiresLogin, cart.add);

    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.get('/forgot', users.forgot);
    app.get('/reset/:token', users.reset);
    app.post('/forgot', users.forgotPassword);
    app.post('/reset/:token', users.resetPassword);
    app.post('/users', users.create);
    app.post('/users/session',
        pauth('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session);
    // Show information user.
    app.get('/users/:userId', auth.requiresLogin, users.show);
    app.put('/users/:userId', auth.requiresLogin, users.updateUser);
    app.get('/auth/facebook',
        pauth('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/login'
        }), users.signin);
    app.get('/auth/facebook/callback',
        pauth('facebook', {
            failureRedirect: '/login',
            successRedirect: '/',
            scope: [
                'email'
            ]
        }), users.authCallback);
    app.get('/auth/github', pauth('github', fail), users.signin);
    app.get('/auth/github/callback',
        pauth('github', {
            failureRedirect: '/login',
            successRedirect: '/',
            scope: [
                'email'
            ]
        }), users.authCallback);
    app.get('/auth/twitter', pauth('twitter', fail), users.signin);
    app.get('/auth/twitter/callback', pauth('twitter', fail), users.authCallback);
    app.get('/auth/google',
        pauth('google', {
            fail,
            scope: ['profile', 'email']
        }), users.signin);
    app.get('/auth/google/callback', pauth('google', fail), users.authCallback);
    app.get('/auth/linkedin',
        pauth('linkedin', {
            fail,
            scope: ['r_basicprofile', 'r_emailaddress']
        }), users.signin);
    app.get('/auth/linkedin/callback', pauth('linkedin', fail), users.authCallback);

    app.param('userId', users.load);

    // article routes
    app.param('id', articles.load);
    app.get('/articles', articles.index);
    app.get('/articles/new', auth.requiresLogin, articles.new);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:id', articles.show);
    app.get('/articles/:id/edit', articleAuth, articles.edit);
    app.put('/articles/:id', articleAuth, articles.update);
    app.delete('/articles/:id', articleAuth, articles.destroy);

    // gift card routes
    app.get('/giftcards', auth.requiresLogin, giftcards.giftcardByUser);
    app.get('/giftcards/new', auth.requiresLogin, giftcards.new);
    app.post('/giftcards', auth.requiresLogin, giftcards.create);
    app.get('/giftcards/:giftId', giftcards.show);
    app.get('/giftcards/:giftId/edit', editGiftCardAuth, giftcards.edit);
    app.put('/giftcards/:giftId', giftCardAuth, giftcards.update);
    app.delete('/giftcards/:giftId', giftCardAuth, giftcards.destroy);
    app.post('/giftcards/sell', giftCardAuth, giftcards.sell);
    app.post('/giftcards/confirm-buy', auth.requiresLogin, giftcards.confirmBuy);

    // order routes
    app.post('/orders/order', auth.requiresLogin, orders.order);
    app.post('/orders/buy-order', auth.requiresLogin, orders.buyOrder);
    app.get('/orders/list', auth.requiresLogin, orders.index);
    app.get('/orders/sell-order', auth.requiresLogin, orders.sellOrder);
    app.get('/orders/buy-order', auth.requiresLogin, orders.buyOrder);
    app.post('/orders/clear-order', auth.requiresLogin, orders.clearOrder);

    // Transaciton routes
    app.post('/transactions/order', auth.requiresLogin, transactions.transaction);
    // app.get('/transaction/cart', auth.requiresLogin, transactions.transaction);

    // home route
    app.get('/', giftcards.index);
    // This will handle 404 requests.
    app.get('*', index.badRequest);

    // comment routes
    app.param('commentId', comments.load);
    app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
    app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
    app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

    // tag routes
    app.get('/tags/:tag', tags.index);

    /**
     * Error handling
     */

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }

        console.error(err.stack);

        if (err.stack.includes('ValidationError')) {
            res.status(422).render('422', { error: err.stack });
            return;
        }

        // error page
        res.status(500).render('500', { error: err.stack });
    });

    app.use(csrf({ cookie: false }));
    app.use(flash());

    // assume 404 since no middleware responded
    app.use(function (req, res) {
        const payload = {
            url: req.originalUrl,
            error: 'Not found'
        };
        if (req.accepts('json')) return res.status(404).json(payload);
        res.status(404).render('404', payload);
    });
};
