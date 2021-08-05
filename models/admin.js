let mongoose = require('mongoose')
let admin = require('../schemas/admin')

module.exports = mongoose.model('admins', admin)
