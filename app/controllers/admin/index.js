/**
 * Created by tranthanhit on 24/07/2017.
 */

const mongoose = require('mongoose');

const { wrap: async } = require('co');
const { respond } = require('../../utils');

const User = mongoose.model('User');
const GiftCard = mongoose.model('GiftCard');
const Transaction = mongoose.model('Transaction');


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
                            res.redirect('/admin/users');
                        }
                    });
                } else {
                    res.redirect('/admin/users');
                }
            }
        );
    } else {
        res.redirect('/admin/users');
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
/**
 * List GiftCard
 */
exports.listgift = async(function* (req, res) {
    const options = {};
    const giftcards = yield GiftCard.list(options);
    User.findOne({ _id : giftcards.user } , function (err, users) {
        if (!err && users) {
            console.log(users.name);

        } else {
            console.log('not found');
        }

    });
    respond(res, 'admin/listgift', {
        title: 'List GiftCard',
        giftcards: giftcards
    });
});

// exports.listgift = (req, res) => {
//     // Call Service list GiftCard.
//     GiftCard.find({}, (err, giftcards) => {
//         if (!err && giftcards){
//             console.log('gift card:',giftcards);
//             User.findOne({ _id: giftcards.user } , function (err, users) {
//                 if (!err && users) {
//                     console.log(users.name);
//
//                 }
//                 res.render('admin/listgift', {
//                     title: 'GiftCard',
//                     giftcards: giftcards,
//                     user: users
//                 });
//             });
//         }
//
//     });
//
// };
/**
 * show detail
 */
exports.show = async(function* (req, res) {
    const giftcards = yield GiftCard.load(req.param('giftId'));
    respond(res, 'admin/show', {
        title: 'Show gift card detail',
        giftcards: giftcards
    });
});
/**
 * List Transaction
 */

exports.transaction = (req, res) => {
    // Call Service list Transaction.
    Transaction.find({}, (err, transaction) => {
        console.log(transaction);
        res.render('admin/transaction', {
            title: 'Transaction',
            transactions: transaction
        });
    });
};
