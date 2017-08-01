'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../');
const User = mongoose.model('Users');

/**
 * Expose
 */

module.exports = new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'email', 'gender', 'displayName', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },
    function (accessToken, refreshToken, profile, done) {
        console.log('Profile: ', profile);
        const options = {
            criteria: { 'facebook.id': profile.id }
        };
        User.load(options, function (err, user) {
            if (err) return done(err);
            if (!user) {
                console.log('User: ', user);
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    admin: false,
                    username: profile.username,
                    provider: 'facebook',
                    facebook: profile._json
                });
                user.save(function (err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
    }
);
