'use strict';

/**
 *  Generic require login routing middleware.
 */

exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    if (req.method == 'GET') req.session.returnTo = req.originalUrl;
    res.redirect('/login');
};

/**
 *  User authorization routing middleware.
 */

exports.user = {
    hasAuthorization: function (req, res, next) {
        console.log(req.profile.user);
        if (req.profile.id != req.user.id) {
            req.flash('info', 'You are not authorized');
            return res.redirect('/users/' + req.profile.id);
        }
        next();
    }
};


/**
 *  Admin authorization routing middleware
 */

exports.admin = {
    hasAuthorization: function (req, res, next) {
        console.log('Req user: ', req.user);
        if (req.user && req.user.admin == true) {
            req.session.returnTo = '/admin';
            next();
        } else {
            req.flash('info', 'You are not authorized');
            return res.redirect('/');
        }
    }
};

/**
 *  Article authorization routing middleware
 */

exports.article = {
    hasAuthorization: function (req, res, next) {
        if (req.article.user.id != req.user.id) {
            req.flash('info', 'You are not authorized');
            return res.redirect('/articles/' + req.article.id);
        }
        next();
    }
};

/**
 * Comment authorization routing middleware
 */

exports.comment = {
    hasAuthorization: function (req, res, next) {
        // if the current user is comment owner or article owner
        // give them authority to delete
        if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
            next();
        } else {
            req.flash('info', 'You are not authorized');
            res.redirect('/articles/' + req.article.id);
        }
    }
};
