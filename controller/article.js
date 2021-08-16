const jsonwebtoken = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId
const article = require('../models/article')
const curd = require('./util/curd.js')

async function index(ctx, next) {
	let match = ctx.request.query.author == '' ? {title: {$regex: ctx.request.query.title}} : {title: {$regex: ctx.request.query.title}, author: {$eq: ObjectId(ctx.request.query.author)}}
  let docs = await article.aggregate([ 
		{
			$lookup: {
				from: 'comments', 
				localField: '_id', 
				foreignField: 'article', 
				as: 'comments' 
			},
		},
		{ 
			$match: match
		},
		{
			$skip: (ctx.request.query.page - 1) * parseInt(ctx.request.query.limit)
		},
		{
			$limit: parseInt(ctx.request.query.limit)
		},
		{
			$sort: {'updated_at': -1}
		}
	])
	await article.populate(docs,{path: 'author'}).then((data) => {
		ctx.body = {
			success: true,
			message: '查询成功',
			data: data
		}
	})
}

async function myindex(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			let query = {title: {$regex: ctx.request.query.title}, author: ObjectId(data._id), page: ctx.request.query.page, limit: ctx.request.query.limit}
			await curd.index(article,query,ctx,'author')
		}
	})
}

async function show(ctx, next) {
	ctx.verifyParams({
		_id: {
			type: 'string',
			required: true
		}
	})
	await curd.show(article,ctx,'author')
}

async function create(ctx, next) {
	ctx.verifyParams({
		title: {
			type: 'string',
			required: true
		},
		content: {
			type: 'string',
			required: true
		}
	})
	
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			ctx.request.body.author = data._id
		  await curd.create(article,ctx)
		}
	})
}

async function update(ctx, next) {
	ctx.verifyParams({
		_id: {
			type: 'string',
			required: true
		},
		title: {
			type: 'string',
			required: true
		},
		content: {
			type: 'string',
			required: true
		}
	})
	await curd.update(article,ctx)
}

/*
 * 文章点赞接口
 */
async function praise(ctx, next) {
	ctx.verifyParams({
		article: {
			type: 'string',
			required: true
		}
	})
	
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			await article.findOne({_id: ctx.request.body.article}).then(async (data1) => {
				if(data1) {
					let i = data1.praises.indexOf(data._id)
					if(i == -1) {
						data1.praises.push(data._id)
					}else{
						data1.praises.splice(i,1)
					}
					await article.updateOne({_id: ctx.request.body.article},{praises: data1.praises}).then((data2) =>  {
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
	await curd.del(article,ctx)
}

module.exports = {
	index,
	myindex,
	show,
	create,
	update,
	praise,
	del
}