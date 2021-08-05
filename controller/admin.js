const jsonwebtoken = require('jsonwebtoken')
const admin = require('../models/admin')
const curd = require('./util/curd.js')

async function login(ctx, next) {
	ctx.verifyParams({
		name: {
			type: 'string',
			required: true
		},
		password: {
			type: 'string',
			required: true
		}
	})
	
	await admin.findOne(ctx.request.body).then((data) => {
		if(data) {
			let token = jsonwebtoken.sign({
				_id: data._id,
				name: data.name
			}, 'xshusnow', { expiresIn: 3600 * 24 })
			ctx.body = {
				success: true,
				message: '登录成功',
				data: data,
				token: token
			}
		} else {
			ctx.body = {
				success: false,
				message: '用户名或密码输入错误'
			}
		}
	})
}

async function verify(ctx, next) {
  await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			if(data.name == 'admin') {
				await next()
			}else{
				ctx.body = {
					message: '您不是超级管理员,没有该权限',
					success: false
				}
			}
		}
	})
}

async function index(ctx, next) {
	let query = {name: {$regex: ctx.request.query.name}, page: ctx.request.query.page, limit: ctx.request.query.limit}
	await curd.index(admin,query,ctx)
}

async function showself(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			await admin.findOne({_id: data._id}).then((data) => {
				if(data) {
					ctx.body = {
						success: true,
						message: '查询成功',
						data: data
					}
				}else{
					ctx.body = {
						success: false,
						message: '查询失败'
					}
				}
			})
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
	await curd.show(admin,ctx)
}

async function create(ctx, next) {
	ctx.verifyParams({
		name: {
			type: 'string',
			required: true
		},
		password: {
			type: 'string',
			required: true
		}
	})
	let unique = true
	await admin.findOne({name: ctx.request.body.name}).then((data) => {
		if(data) {
			unique = false
		}
	})
	if(unique) {
		await curd.create(admin,ctx)
	}else{
		ctx.body = {
			success: false,
			message: '用户名重复'  
		}
	}
}

async function edit(ctx, next) {
	ctx.verifyParams({
		name: {
			type: 'string',
			required: true
		}
	})
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			if(data.name == 'admin' && data.name != ctx.request.body.name) {
				ctx.body = {
					success: false,
					message: '超级管理员的名称不可修改'
				}
			}else{
				await admin.updateOne({_id: data._id}, {name: ctx.request.body.name, avatar: ctx.request.body.avatar, updated_at: Date()}).then((data1) => {
					if(data1.n == 1) {
						ctx.body = {
							success: true,
							message: '修改成功'
						}
					}else{
						ctx.body = {
							success: false,
							message: '修改失败'
						}
					}
				})
			}
		}
	})
}

async function update(ctx, next) {
	ctx.verifyParams({
		_id: {
			type: 'string',
			required: true
		},
		name: {
			type: 'string',
			required: true
		},
		password: {
			type: 'string',
			required: true
		}
	})
	
	let unique = true
	await admin.findOne({name: ctx.request.body.name}).then((data) => {
		if(data) {
			unique = data._id == ctx.request.body._id
		}
	})
	if(unique) {
		await curd.update(admin,ctx)
	}else{
		ctx.body = {
			success: false,
			message: '用户名重复'
		}
	}
}

async function del(ctx, next) {
	ctx.verifyParams({
		_id: {
			type: 'string',
			required: true
		}
	})
	
	await curd.del(admin,ctx)
}

module.exports = {
	login,
	verify,
	index,
	showself,
	show,
	create,
	edit,
	update,
	del
}