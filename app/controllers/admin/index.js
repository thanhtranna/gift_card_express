/**
 * Created by tranthanhit on 24/07/2017.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond , respondOrRedirect } = require('../../utils');
const User = mongoose.model('User');
const GiftCard = mongoose.model('GiftCards');


/**
 * Load
 */

exports.index = (req, res) => {
    // Response and render page.
    respond(res, 'admin/index', {
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
        respond(res, 'admin/user/users', {
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
                    // Response and render a webpage.
                    respond(res, 'admin/user/edit-user', {
                        title: 'Edit User',
                        user: user
                    });
                } else {
                    // Redirect page.
                    respondOrRedirect({ req, res }, '/admin/users', {}, {
                        type: 'success',
                        text: 'Edit user successfully'
                    });
                }
            }
        );
    } else {
        // res.redirect('admin/users');
        respondOrRedirect({ req, res }, '/admin/users', {}, {
            type: 'warning',
            text: 'Cannot find id user'
        });
    }
};

/**
 * Update information Admin by id.
 * Method: POST
 */

exports.updateAdminById = (req, res) => {
    // Handle id admin user.
    let userId = req.body.id;
    if (userId) {
        // Service find user by id.
        User.findOne({
                _id: userId
            }, (err, user) => {
                console.log(user);
                if (!err && user) {
                    user.name = req.body.name;
                    // user.admin = req.body.admin == 0 ? false : true ;
                    user.save((err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // res.redirect('/admin/users');
                            console.log('Update thanh cong!');
                            respondOrRedirect({ req, res }, '/admin/users', {}, {
                                type: 'success',
                                text: 'Update admin information successfully'
                            });
                        }
                    });
                } else {
                    // res.redirect('/admin/users');
                    console.log('Khong tim thay user.');
                    respondOrRedirect({ req, res }, '/admin/users', {}, {
                        type: 'errors',
                        text: 'Cannot found user from database!'
                    });
                }
            }
        );
    } else {
        // res.redirect('/admin/users');
        respondOrRedirect({ req, res }, '/admin/users', {}, {
            type: 'warning',
            text: 'Cannot find id user'
        });
    }
};


/**
 * Show profile admin.
 * Method: GET
 */

exports.profileAdmin = (req, res) => {
    let userId = req.user._id;
    console.log('ID User: ', userId);
    if (userId) {
        // Service find user by id.
        User.findOne({
                _id: userId
            }, (err, user) => {
                console.log(user);
                if (!err && user) {
                    // Response and render a webpage.
                    respond(res, 'admin/user/profile', {
                        title: 'Admin Info',
                        user: user
                    });
                } else {
                    // Redirect page.
                    respondOrRedirect({ req, res }, '/admin/users', {}, {
                        type: 'success',
                        text: 'Edit user successfully'
                    });
                }
            }
        );
    } else {
        // res.redirect('admin/users');
        respondOrRedirect({ req, res }, '/admin/users', {}, {
            type: 'warning',
            text: 'Cannot find id user'
        });
    }
};

/**
 * Update information user by id.
 * Method: POST
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
                    console.log(req.body);
                    user.name = req.body.name;
                    user.admin = req.body.admin == 0 ? false : true ;
                    user.save((err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // res.redirect('/admin/users');
                            console.log('Update thanh cong!');
                            respondOrRedirect({ req, res }, '/admin/users', {}, {
                                type: 'success',
                                text: 'Update user successfully'
                            });
                        }
                    });
                } else {
                    // res.redirect('/admin/users');
                    console.log('Khong tim thay user.');
                    respondOrRedirect({ req, res }, '/admin/users', {}, {
                        type: 'errors',
                        text: 'Cannot found user from database!'
                    });
                }
            }
        );
    } else {
        // res.redirect('/admin/users');
        respondOrRedirect({ req, res }, '/admin/users', {}, {
            type: 'warning',
            text: 'Cannot find id user'
        });
    }
};

/**
 * Delete user by id.
 * Method: POST
 */

exports.deleteUserById = (req, res) => {
    let idUser = req.body.userId;
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
            console.log('Xoa thanh cong!');
        }
    });
};
/**
 * List GiftCard
 */
exports.listgift = async(function* (req, res) {
    const options = {};
    const giftcards = yield GiftCard.list(options);
    respond(res, 'admin/giftcard/listgift', {
        title: 'List GiftCard',
        giftcards: giftcards
    });
});

/**
 * show detail
 */
exports.show = async(function* (req, res) {
    const giftcards = yield GiftCard.load(req.param('giftId'));
    respond(res, 'admin/giftcard/show', {
        title: 'Show gift card detail',
        giftcards: giftcards
    });
});
