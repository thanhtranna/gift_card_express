'use strict';

/*
 * Module dependencies.
 */
const csrf = require('csurf');
const flash = require('express-flash');
const adminUser = require('../app/controllers/admin/index');
const users = require('../app/controllers/users');
const articles = require('../app/controllers/articles');

const categories = require('../app/controllers/admin/categories');
const giftcards = require('../app/controllers/giftcards');
const giftcardsAdmin = require('../app/controllers/admin/giftcards');
const comments = require('../app/controllers/comments');
const tags = require('../app/controllers/tags');
const auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];
const adminAuth = [auth.requiresLogin, auth.admin.hasAuthorization];
const giftcardAuth = [auth.requiresLogin, auth.giftcard.hasAuthorization];

const fail = {
    failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app, passport) {


    const pauth = passport.authenticate.bind(passport);

    // admin routes.
    app.get('/admin', adminUser.index);
    app.get('/admin/users', adminUser.users);
    app.get('/admin/user/edit/:userId', adminUser.editUserById);
    app.post('/admin/user/edit/:userId', adminUser.updateUserById);
    app.post('/admin/user/delete', adminUser.deleteUserById);

    // admin users management routes.
    app.get('/admin', adminAuth, adminUser.index);
    app.get('/admin/users', adminAuth, adminUser.users);
    app.get('/admin/user/edit/:userId', adminAuth, adminUser.editUserById);
    app.get('/admin/user/profile', adminAuth, adminUser.profileAdmin);
    app.post('/admin/user/profile', adminAuth, adminUser.updateAdminById);
    app.post('/admin/user/edit/:userId', adminAuth, adminUser.updateUserById);
    app.post('/admin/user/delete', adminAuth, adminUser.deleteUserById);

    // category routes. admin permission
    app.get('/admin/categories', adminAuth, categories.index);
    app.get('/admin/categories/new', adminAuth, categories.new);
    app.post('/admin/categories', adminAuth, categories.create);
    app.get('/admin/categories/:catId', adminAuth, categories.show);
    app.get('/admin/categories/:catId/edit', adminAuth, categories.edit);
    app.put('/admin/categories/:catId', adminAuth, categories.update);
    app.delete('/admin/categories/:catId', adminAuth, categories.destroy);

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
    app.get('/users/:userId', users.show);
    app.get('/auth/facebook',
        pauth('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/login'
        }), users.signin);
    app.get('/auth/facebook/callback', pauth('facebook', fail), users.authCallback);
    app.get('/auth/github', pauth('github', fail), users.signin);
    app.get('/auth/github/callback', pauth('github', fail), users.authCallback);
    app.get('/auth/twitter', pauth('twitter', fail), users.signin);
    app.get('/auth/twitter/callback', pauth('twitter', fail), users.authCallback);
    app.get('/auth/google',
        pauth('google', {
            failureRedirect: '/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin);
    app.get('/auth/google/callback', pauth('google', fail), users.authCallback);
    app.get('/auth/linkedin',
        pauth('linkedin', {
            failureRedirect: '/login',
            scope: [
                'r_emailaddress'
            ]
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

    // gift card route
    app.get('/giftcards', auth.requiresLogin, giftcards.giftcardByUser);
    app.get('/giftcards/new', auth.requiresLogin, giftcards.new);
    app.post('/giftcards', auth.requiresLogin, giftcards.create);
    app.get('/giftcards/:giftId', giftcards.show);
    app.get('/giftcards/:giftId/edit', giftcardAuth, giftcards.edit);
    app.put('/giftcards/:giftId', giftcardAuth, giftcards.update);
    app.delete('/giftcards/:giftId', giftcardAuth, giftcards.destroy);
    app.post('/giftcards/sell', giftcardAuth, giftcards.sell);

    // gift card admin route
    adminAuth
    app.get('/admin/giftcards', adminAuth, giftcardsAdmin.index);
    app.put('/admin/giftcards/:giftId/auth_gift', giftcardsAdmin.authGift);


    // home route
    app.get('/', giftcards.index);

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
