var mongoose = require('mongoose');
var NovelSchema = require('../schemas/novel.js');
var Novel = mongoose.model('Novel',NovelSchema);

module.exports = Novel;