const jsonwebtoken = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId
const friendreq = require('../models/friendreq')
const friend = require('../models/friend')
const curd = require('./util/curd.js')

async function index(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			let query = {to: ObjectId(data._id), status: {$regex: ctx.request.query.status}, page: ctx.request.query.page, limit: ctx.request.query.limit}
			await curd.index(friendreq,query,ctx,'from')
		}
	})
}

async function count(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{			
			let count = await friendreq.find({to: data._id, status: '待验证'}).countDocuments().exec()
			ctx.body = {
				message: '查询成功',
				data: count,
				success: true
			}
		}
	})
}

async function isrequested(ctx, next) {
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
			let query = {$or: [{from: data._id, to: ctx.request.query.to}, {from: ctx.request.query.to, to: data._id}], status: '待验证'}
			await friendreq.findOne(query).then((data1) => {
				ctx.body = {
					message: '查询成功',
					data: data1,
					success: true
				}
			})
		}	
	})
}

async function deal(ctx, next) {
	ctx.verifyParams({
		_id: {
			type: 'string',
			required: true
		},
		status: {
			type: 'string',
			required: true
		},
		from: {
			type: 'string',
			required: true
		}
	})
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			await friendreq.updateOne({_id: ctx.request.body._id},{status: ctx.request.body.status}).then(async (data1) =>  {
				if(ctx.request.body.status == '已通过') {
					delete ctx.request.body.status
					delete ctx.request.body._id
					ctx.request.body.to = data._id
					await curd.create(friend,ctx)
				}else if(ctx.request.body.status == '已拒绝') {
					ctx.body = {
						message: '操作成功',
						success: true
					}
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
	await curd.del(friendreq, ctx)
}

module.exports = {
	index,
	count,
	isrequested,
	deal,
	del
}