let mongoose = require('mongoose')
let friend = require('../schemas/friend')

module.exports = mongoose.model('friends', friend)