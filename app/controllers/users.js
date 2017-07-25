'use strict';

/**
 * Module dependencies.
 */
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const asynct = require('async');
const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');

/**
 * Load
 */

exports.load = async(function* (req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = yield User.load({ criteria });
    if (!req.profile) return next(new Error('User not found'));
  } catch (err) {
    return next(err);
  }
  next();
});

/**
 * Create user
 */

exports.create = async(function* (req, res) {
  const user = new User(req.body);
  console.log('User create: ', user);
  user.provider = 'local';
  try {
    yield user.save();
    req.logIn(user, err => {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!');
      return res.redirect('/');
    });
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message);

    res.render('users/signup', {
      title: 'Sign up',
      errors,
      user
    });
  }
});

/**
 *  Show profile
 */

exports.show = function (req, res) {
  const user = req.profile;
  respond(res, 'users/show', {
    title: user.name,
    user: user
  });
};

exports.signin = function () {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  });
};


/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Show forgot password form
 * Method: GET
 */

exports.forgot = function (req, res) {
    res.render('users/forgot', {
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
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                // Reset password.
                user.password = '12345';

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
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err)
            return next(err);
        res.redirect('/forgot');
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
            return res.redirect('/forgot');
        }
        console.log('Req.user: ', req.user);
        res.render('users/reset', {
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
                    req.flash('warning', 'Password reset token is invalid or has expired.');
                    console.log('Req flash warning: ', req.flash('warning'));
                    return res.redirect('back');
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

                    // req.logIn(user, (err) => {
                    //
                    // });
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
                done(err);
            });
        }
    ], (err) => {
        res.redirect('/login');
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
  const redirectTo = req.session.returnTo
    ? req.session.returnTo
    : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}
