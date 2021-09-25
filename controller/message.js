const jsonwebtoken = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId
const message = require('../models/message')
const curd = require('./util/curd.js')
const msocket = require('../models/socket')

async function index(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			let query = {"$or": [{"to": data._id},{"from": data._id}]}
	    await curd.index(message,query,ctx,'from',['name','avatar'],'to',['name','avatar'])
		}
	})
}

async function chatIndex(ctx, next) {
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
			let query = {
				$or: [
				  {from: data._id, to: ctx.request.query.to},
				  {from: ctx.request.query.to, to: data._id},
				],
				$or: [
					{deletes: []},
					{deletes: [ctx.request.query.to]}
				],
				page: ctx.request.query.page, 
				limit: ctx.request.query.limit
			}
			
	    await curd.index(message,query,ctx,'from',['name','avatar'])
		}
	})
}

async function setRead(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			await message.updateMany({
				from: ctx.request.body.from,
        to: data._id,
				read: false
      },{$set: {read: true}})
      .then(async data1 => {
				let unread = await message.find({to: data._id,read: false}).countDocuments().exec()
				ctx.body = {
					success: true,
					message: '修改成功',
					data: unread
				}
      }).catch(err => next(err))
		}
	})
}

async function delchat(ctx, next) {
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
			let delquery = {
				$or: [
				  {from: data._id, to: ctx.request.body.to},
				  {from: ctx.request.body.to, to: data._id},
			  ],
				deletes: [ctx.request.body.to]
			}
			let updatequery = {
				/*$or: [
				  {from: data._id, to: ctx.request.body.to},
				  {from: ctx.request.body.to, to: data._id},
			  ],*/
				$or: [
					{from: data._id, to: ctx.request.body.to,deletes: []},
					{from: data._id, to: ctx.request.body.to,deletes: [ctx.request.body.to]},
					{from: ctx.request.body.to, to: data._id,deletes: []},
					{from: ctx.request.body.to, to: data._id,deletes: [ctx.request.body.to]},
				]
			}
			let updatequery1 = {
				$or: [
				  {from: ctx.request.body.to, to: data._id},
			  ]
			}
	    await message.deleteMany(delquery).then(async (data0) => {
				await message.updateMany(updatequery,{$set: {deletes: [data._id]}})
				await message.updateMany(updatequery1,{$set: {read: true}})
				ctx.body = {
					success: true,
					message: '删除成功'
				}
			})
		}
	})
}

module.exports = {
	index,
	chatIndex,
	setRead,
	delchat
}