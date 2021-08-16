let Schema = require('mongoose').Schema

//定义一个Schema非常简单，指定字段名和类型即可
module.exports = new Schema({
	title: String,
	content: String,
	images: {
		type: Array,
		default: []
	},
	author: {
		type: Schema.ObjectId,
    ref: 'users'
	},
	praises: {
		type: Array,
		default: []
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
