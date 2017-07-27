/**
 * Created by tranthanhit on 27/07/2017.
 */

var path = require('path');
var multer = require('multer');

const MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47',
    gif: '47494638'
};

const pathName = path.join((process.cwd() + ' ').trim(), '/uploads');

// Storage info.
var storage = multer.diskStorage({
    dest: function (req, file, callback) {
        // Config path name.
        console.log(pathName);
        callback(null, pathName);
    },
    filename: function (req, file, callback) {
        console.log(file);
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check magic numbers.
var checkMagicNumbers = ( magic ) => {
    if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif) return true;
}

module.exports = {
    storage,
    checkMagicNumbers
};


