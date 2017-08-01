/**
 * Created by tranthanhit on 26/07/2017.
 */

const { respond } = require('../utils');

// This handle bad request.
exports.badRequest = function (req, res) {
    respond(res, '404', {});
};