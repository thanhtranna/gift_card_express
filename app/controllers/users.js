'use strict';

/**
 * Module dependencies.
 */

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const asynct = require('async');
const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond, respondOrRedirect } = require('../utils');
const User = mongoose.model('Users');

/**
 * Load
 */

exports.load = async(function*(req, res, next, _id) {
    const options = { _id };
    try {
        req.profile = yield User.load({ options });
        if (!req.profile) return next(new Error('User not found'));
    } catch (err) {
        return next(err);
    }
    next();
});

/**
 * Create user
 */

exports.create = async(function*(req, res) {
    const user = new User(req.body);
    console.log('User create: ', user);
    user.provider = 'local';
    try {
        yield user.save();
        req.logIn(user, err => {
            if (err) req.flash('info', 'Sorry! We are not able to log you in!');
            // Response and redirect homepage.
            return respondOrRedirect({ req, res }, '/', {}, {
                type: 'success',
                text: 'Awesome! Login successfully!'
            });
        });
    } catch (err) {
        const errors = Object.keys(err.errors)
            .map(field => err.errors[field].message);
        respond(res, 'users/signup', {
            title: 'Sign up',
            errors,
            user
        });
    }
});

/**
 *  Show profile
 */

exports.show = async(function*(req, res) {
    // const options = {
    //     _id: req.params.userId
    // };
    const options = {
        _id: req.user._id
    };
    // Load User by id.
    // console.log(req.user._id);
    const user = yield User.loadUserById(options);
    respond(res, 'users/show', {
        title: 'Information user.',
        user: user
    });
});

/**
 *  Update information user.
 */

exports.updateUser = async(function*(req, res) {
    // Options when update information user.
    const options = {
        _id: req.param('userId')
    };
    const user = yield User.loadUserById(options);
    user.name = req.body.name;
    if (user.saveUser()) {
        return respondOrRedirect({ req, res }, '/', {}, {
            type: 'success',
            text: 'Update information user successfully.'
        });
    } else {
        return respondOrRedirect({ req, res }, '/users/' + user._id, {}, {
            type: 'errors',
            text: 'Update information user failed!!'
        });
    }
});

exports.signin = function () {
};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 *  Show login form.
 *  Method: GET
 */

exports.login = function (req, res) {
    respond(res, 'users/login', {
        title: 'Login'
    });
};


/**
 * Show sign up form
 * Method: GET
 */

exports.signup = function (req, res) {
    respond(res, 'users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Show forgot password form
 * Method: GET
 */

exports.forgot = function (req, res) {
    // Response and render page.
    respond(res, 'users/forgot', {
        title: 'Forgot Password'
    });
};

/**
 * Forgot password.
 * Method: POST
 */

exports.forgotPassword = (req, res, next) => {
    console.log('Email revert password:', req.body.email);
    asynct.waterfall([
        (done) => {
            // Random token.
            crypto
                .randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
        },
        (token, done) => {
            // Find user by email.
            User.findOne({
                email: req.body.email
            }, (err, user) => {
                if (!user) {
                    console.log('No account from database!!');
                    req.flash('warning', 'No account with that email address exists.');
                    console.log('Req flash warning: ', req.flash('warning'));
                    // Response and redirect webpage.
                    return respondOrRedirect({ req, res }, '/forgot', {}, {
                        type: 'warning',
                        text: 'No account with that email address exists.'
                    });
                }
                // Set token to user.
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                // Update information user.
                user.save((err) => {
                    console.log(err);
                    if (err) return done(err);
                    done(err, token, user);
                });
            });
        },
        (token, user, done) => {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'tranthanh.it.95@gmail.com',
                    pass: 'Vanthanh1995'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'trantranh.it.95@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of' +
                ' the password for your account.\n\nPlease click on the following link, or paste ' +
                'this into your browser to complete the process:\n\nhttp://' + req.headers.host + '/reset/' + token + '\n\nIf you did not request this, please ignore this email and your password will' +
                ' remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                console.log('Send email successfully!!');
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                console.log('Req flash info: ', req.flash('info'));
                done(err, 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            });
        }
    ], (err, message) => {
        if (err)
            return next(err);
        // Response and redirect webpage.
        respondOrRedirect({ req, res }, '/forgot', {}, {
            type: 'success',
            text: message
        });
    });
};

/**
 * Reset password using token.
 * Method: GET
 */

exports.reset = (req, res) => {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, (err, user) => {
        if (!user) {
            req.flash('warning', 'Password reset token is invalid or has expired.');
            console.log('Req flash warning: ', req.flash('warning'));
            // Response and redirect
            return respondOrRedirect({ req, res }, '/forgot', { user }, {
                type: 'warning',
                text: 'Password reset token is invalid or has expired.'
            });
        }
        console.log('Req.user: ', req.user);
        // Response
        respond(res, 'users/reset', {
            title: 'Reset Password'
        });
    });
};

/**
 * Reset password using token.
 * Method: POST
 */

exports.resetPassword = (req, res) => {
    asynct.waterfall([
        (done) => {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, (err, user) => {
                if (!user) {
                    req.flash('errors', 'Password reset token is invalid or has expired.');
                    console.log('Req flash errors: ', req.flash('errors'));
                    // Response and redirect
                    return respondOrRedirect({ req, res }, 'back', {}, {
                        type: 'errors',
                        text: 'Password reset token is invalid or has expired.'
                    });
                }

                console.log('User', user);
                // User information field.
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                // Set password equals user enter.
                user.password = req.body.password;

                user.save((err) => {
                    console.log('User', user);
                    if (err) {
                        console.log(err);
                    } else {
                        done(err, user);
                    }
                });
            });
        },
        (user, done) => {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'tranthanh.it.95@gmail.com',
                    pass: 'Vanthanh1995'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'tranthanh.it.95@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\nThis is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                req.flash('success', 'Success! Your password has been changed.');
                console.log('Req flash success: ', req.flash('success'));
                done(err, 'Success! Your password has been changed.');
            });
        }
    ], (err, message) => {
        // Response and redirect
        respondOrRedirect({ req, res }, '/login', {}, {
            type: 'success',
            text: message
        });
    });
};


/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
    console.log('Req session: ');
    console.log(req.session);
    const redirectTo = req.session.returnTo
        ? req.session.returnTo
        : '/';
    delete req.session.returnTo;
    // res.redirect(redirectTo);
    respondOrRedirect({ req, res }, redirectTo, {}, {
        type: 'success',
        text: 'Login successfully'
    });
}
