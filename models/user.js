let mongoose = require('mongoose')
let user = require('../schemas/user')

module.exports = mongoose.model('users', user)