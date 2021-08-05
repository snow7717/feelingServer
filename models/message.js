let mongoose = require('mongoose')
let message = require('../schemas/message')

module.exports = mongoose.model('messages', message)