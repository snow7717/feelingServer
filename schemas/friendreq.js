let Schema = require('mongoose').Schema

//定义一个Schema非常简单，指定字段名和类型即可
module.exports = new Schema({
	from: {
		type: Schema.ObjectId,
    ref: 'users'
	},
	to: {
		type: Schema.ObjectId,
    ref: 'users'
	},
	message: String,
	status: {
		type: String,
		default: '待验证'
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	}
})
