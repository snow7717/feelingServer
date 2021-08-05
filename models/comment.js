let mongoose = require('mongoose')
let comment = require('../schemas/comment')

module.exports = mongoose.model('comments', comment)