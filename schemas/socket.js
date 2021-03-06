let Schema = require('mongoose').Schema

//定义一个Schema非常简单，指定字段名和类型即可
module.exports = new Schema({
	socket: String,
	user: String,
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	}
})