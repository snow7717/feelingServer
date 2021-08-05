const jsonwebtoken = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId
const comment = require('../models/comment')
const curd = require('./util/curd.js')

async function index(ctx, next) {
	ctx.verifyParams({
		article: {
			type: 'string',
			required: true
		}
	})
	let query = {article: ctx.request.query.article, page: ctx.request.query.page, limit: ctx.request.query.limit}
	await curd.index(comment,query,ctx,'commentator')
}

async function myindex(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			let query = {content: {$regex: ctx.request.query.content}, commentator: ObjectId(data._id), page: ctx.request.query.page, limit: ctx.request.query.limit}
			await curd.index(comment,query,ctx,'article')
		}
	})
}

async function create(ctx, next) {
	ctx.verifyParams({
		article: {
			type: 'string',
			required: true
		},
		commentator: {
			type: 'string',
			required: true
		},
		content: {
			type: 'string',
			required: true
		}
	})
	await curd.create(comment,ctx)
}

/*
 * 评论点赞接口
 */
async function praise(ctx, next) {
	ctx.verifyParams({
		_id: {
			type: 'string',
			required: true
		}
	})
	
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			await comment.findOne({_id: ctx.request.body._id}).then(async (data1) => {
				if(data1) {
					let i = data1.praises.indexOf(data._id)
					if(i == -1) {
						data1.praises.push(data._id)
					}else{
						data1.praises.splice(i,1)
					}
					await comment.updateOne({_id: ctx.request.body._id},{praises: data1.praises}).then((data2) =>  {
						if(data2.n == 1) {
							ctx.body = {
								success: true,
								message: '操作成功',
								data: data1
							}
						}else{
							ctx.body = {
								success: false,
								message: '操作失败'
							}
						}
					})
				}else{
					ctx.body = {
						success: false,
						message: '操作失败,未找到指定文章'
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
	await curd.del(comment,ctx)
}

module.exports = {
	index,
	myindex,
	create,
	praise,
	del
}