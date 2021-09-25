const token = require('../models/token')
const curd = require('./util/curd.js')

async function verify(ctx, next) {
	return await token.find({token: ctx.request.header.authorization.substr(7)})
}

module.exports = {
	verify
}