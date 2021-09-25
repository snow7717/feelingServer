let mongoose = require('mongoose')
let token = require('../schemas/token')

module.exports = mongoose.model('tokens', token)