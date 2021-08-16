const jsonwebtoken = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId
const friend = require('../models/friend')
const curd = require('./util/curd.js')

async function index(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			let query = {$or: [{from: data._id}, {to: data._id}]}
			await friend.find(query).sort({'created_at': -1}).populate('from',['name', 'avatar', 'motto']).populate('to',['name','avatar', 'motto']).then((data1) => {
				ctx.body = {
					success: true,
					message: '查询成功',
					data: data1
				}
			})
		}
	})
}

async function isfriend(ctx, next) {
	ctx.verifyParams({
		to: {
			type: 'string',
			required: true
		}
	})
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			let query = {$or: [{from: data._id, to: ctx.request.query.to}, {from: ctx.request.query.to, to: data._id}]}
			await friend.find(query).then((data1) => {
				ctx.body = {
					success: true,
					data: data1.length > 0,
					message: '查询成功'
				}
			})
		}
	})
}

async function del(ctx, next) {
	ctx.verifyParams({
		_id: {
			type: 'string',
			required: true
		}
	})
	
	await curd.del(friend,ctx)
}

module.exports = {
	index,
	isfriend,
	del
}
