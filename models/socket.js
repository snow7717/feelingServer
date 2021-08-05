let mongoose = require('mongoose')
let socket = require('../schemas/socket')

module.exports = mongoose.model('sockets', socket)