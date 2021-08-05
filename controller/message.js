const jsonwebtoken = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId
const message = require('../models/message')
const curd = require('./util/curd.js')

async function index(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			let query = {to: data._id, read: ctx.request.query.read}
	    await curd.index(message,query,ctx,'from')
		}
	})
}

module.exports = {
	index
}