const jsonwebtoken = require('jsonwebtoken')
const user = require('../models/user')
const message = require('../models/message')
const curd = require('./util/curd.js')

async function register(ctx, next) {
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
	await user.findOne({name: ctx.request.body.name}).then((data) => {
		if(data) {
			unique = false
		}
	})
	if(unique) {
		await curd.create(user,ctx,true)
	}else{
		ctx.body = {
			success: false,
			message: '用户名重复'  
		}
	}
}

async function login(ctx,next) {
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
	
	await user.findOne(ctx.request.body).then(async (data) => {
		if(data) {
			let token = jsonwebtoken.sign({
				_id: data._id,
				name: data.name
			}, 'xshusnow', { expiresIn: 3600 * 24 })
			let unread = await message.find({to: data._id,read: false}).countDocuments().exec()
			ctx.body = {
				success: true,
				message: '登录成功',
				data: data,
				unread: unread,
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

async function update(ctx, next) {
	await jsonwebtoken.verify(ctx.request.header.authorization.substring(7), 'xshusnow', async (error, data) => {
		if(error) {
			console.error(error)
		}else{
			let unique = true
			await user.findOne({name: ctx.request.body.name}).then((data1) => {
				if(data1) {
					unique = data1._id == ctx.request.body._id
				}
			})
			if(unique) {
				await user.updateOne({_id: data._id}, ctx.request.body).then((data1) => {
					if(data1.n == 1) {
						ctx.body = {
							success: true,
							message: '修改成功',
							data: data
						}
					}else{
						ctx.body = {
							success: false,
							message: '修改失败'
						}
					}
				})
			}else{
				ctx.body = {
					success: false,
					message: '用户名重复'
				}
			}
		}
	})
}

module.exports = {
	register,
	login,
	update
}