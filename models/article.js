let mongoose = require('mongoose')
let article = require('../schemas/article')

module.exports = mongoose.model('articles', article)