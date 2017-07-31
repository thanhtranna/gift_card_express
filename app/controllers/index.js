/**
 * Created by tranthanhit on 26/07/2017.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');

// This handle bad request.
exports.badRequest = async(function* (req, res) {
    respond(res, '404', {});
});