let mongoose = require('mongoose')
let friendreq = require('../schemas/friendreq')

module.exports = mongoose.model('friendreqs', friendreq)