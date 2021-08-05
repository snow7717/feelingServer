const jsonwebtoken = require('jsonwebtoken')

async function index(model,query,ctx,populateField = '') {
	let {page,limit,...filterQuery} = query
	let total = await model.find(filterQuery).countDocuments().exec()
	await model.find(filterQuery).skip((query.page - 1) * parseInt(query.limit)).limit(parseInt(query.limit)).sort({'updated_at': -1}).populate(populateField).then((data) => {
		ctx.body = {
			success: true,
			message: '查询成功',
			data: data,
			total: total
		}
	}).catch(err => {
		ctx.body = {
			success: false,
			message: err
		}
	})
}

async function show(model,ctx,populateField = '') {
	await model.findOne({_id: ctx.request.query._id}).populate(populateField).then((data) => {
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

async function create(model,ctx,register = false) {
	await model.create(ctx.request.body).then((data) => {
		if(data) {
			let token
			if(register) {
				token = jsonwebtoken.sign({
					_id: data._id,
					name: data.name
				}, 'xshusnow', { expiresIn: 3600 * 24 })
			}
			ctx.body = {
				success: true,
				message: '操作成功',
				data: data,
				token: token
			}
		}else{
			ctx.body = {
				success: false,
				message: '操作失败'
			}
		}
	}).catch(err => {
		ctx.body = {
			success: false,
			message: err
		}
	})
}

async function update(model,ctx) {
	ctx.request.body.updated_at = Date()
  await model.updateOne({_id: ctx.request.body._id},ctx.request.body).then((data) =>  {
		if(data.n == 1) {
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

async function del(model,ctx) {
	await model.findOneAndDelete({_id: ctx.request.body._id}).then((data) => {
		if(data) {
			ctx.body = {
				success: true,
				message: '删除成功',
				data: data
			}
		}else{
			ctx.body = {
				success: false,
				message: '删除失败'
			}
		}
	})
}

module.exports = {
	index,
	show,
	create,
	update,
	del
}