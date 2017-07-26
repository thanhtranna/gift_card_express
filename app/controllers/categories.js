const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond, respondOrRedirect } = require('../utils');
const Categories = mongoose.model('Categories');


exports.index = async(function* (req, res) {
    const options = {};
    const categories = yield Categories.list(options);
    respond(res, 'categories/index', {
        title: 'List Categories',
        categories: categories,
    });
});

/**
 * New categories
 */

exports.new = async(function* (req, res) {
    const options = {
        parent: null
    };
    const categories = yield Categories.list(options);
    respond(res, 'categories/new', {
        title: 'Create Categories',
        categories: categories,
        category: new Categories()
    });
});

/**
 * Create an category
 */

exports.create = async( function* (req, res ) {
    const category = new Categories();
    category.name = req.body.name;
    category.description = req.body.description;
    category.parent = (req.body.parent == 0) ? null : req.body.parent;
    try {
        if (category.saveCat()) {
            const options = {};
            const categories = yield Categories.list(options);
            respondOrRedirect({ req, res }, '/categories', categories, {
                type: 'success',
                text: 'Successfully created categories!'
            });
        }
    } catch (err) {
        respond(res, 'category/new', {
            title: 'New category',
            errors: [err.toString()],
            category
        }, 422);
    }
});


/**
 * Show detail category
 */
exports.show = async(function* (req, res) {
    const category = yield Categories.load(req.param('catId'));
    respond(res, 'categories/show', {
        title: 'Show category detail',
        category: category
    });
});

/**
 * Edit category
 */

exports.edit = async(function* (req, res) {
    const category = yield Categories.load(req.param('catId'));
    const options = {
        parent: null
    };
    const categories = yield Categories.list(options);
    respond(res, 'categories/edit', {
        title: 'Edit ' + category.name,
        category: category,
        categories: categories
    });
});

/**
 * Update category
 */

exports.update = async(function* (req, res){
    const category = yield Categories.load(req.param('catId'));
    category.name = req.body.name;
    category.description = req.body.description;
    category.parent = (req.body.parent == 0) ? null : req.body.parent;
    try {
        if (category.saveCat()) {
            const options = {};
            const categories = yield Categories.list(options);
            respondOrRedirect({ req, res }, '/categories', categories, {
                type: 'success',
                text: 'Successfully update categories!'
            });
        }
    } catch (err) {
        respond(res, 'category/#{category._id}/edit', {
            title: 'Edit category',
            errors: [err.toString()],
            category
        }, 422);
    }
});

/**
 * Delete category.
 */

exports.destroy = async(function* (req, res) {
    const category = yield Categories.load(req.param('catId'));
    category.remove();
    respondOrRedirect({ req, res }, '/categories', {}, {
        type: 'info',
        text: 'Deleted successfully'
    });
});
