/**
 * Created by tranthanhit on 24/07/2017.
 */

const mongoose = require('mongoose');
const {wrap: async} = require('co');
const {respond} = require('../../utils');
const User = mongoose.model('User');


/**
 * Load
 */

exports.index = (req, res) => {
    res.render('admin/index', {
        title: 'Admin Index'
    });
};

/**
 * List Users
 */

exports.users = (req, res) => {
    // Call Service list User.
    User.find({
        block: 0
    }, (err, users) => {
        console.log(users);
        res.render('admin/users', {
            title: 'Users',
            users: users
        });
    });
};


/**
 * Update information user by id.
 * Method: GET
 */

exports.editUserById = (req, res) => {
    let userId = req.params.userId;
    if (userId) {
        // Service find user by id.
        User.findOne({
                _id: userId
            }, (err, user) => {
                console.log(user);
                if (!err && user) {
                    res.render('admin/edit-user', {
                        title: 'Edit User',
                        user: user
                    });
                } else {
                    res.redirect('admin/users');
                }
            }
        );
    } else {
        res.redirect('admin/users');
    }
};

/**
 * Update information user by id.
 * Method: GET
 */

exports.updateUserById = (req, res) => {
    let userId = req.params.userId;
    if (userId) {
        // Service find user by id.
        User.findOne({
                _id: userId
            }, (err, user) => {
                console.log(user);
                if (!err && user) {
                    res.render('admin/edit-user', {
                        title: 'Edit User',
                        user: user
                    });
                } else {
                    res.redirect('admin/users');
                }
            }
        );
    } else {
        res.redirect('admin/users');
    }
};

/**
 * Delete user by id.
 */

exports.deleteUserById = (req, res) => {
    let idUser = req.body.userId;
    console.log(idUser);
    User.update({
        _id: idUser
    }, {
        $set: {
            block: 1
        }
    }, {
        multi: true
    }, (err) => {
        if (err) {
            throw err;
        } else {
            res.json(400);
        }
    });
};
