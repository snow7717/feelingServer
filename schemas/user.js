let Schema = require('mongoose').Schema

//定义一个Schema非常简单，指定字段名和类型即可
module.exports = new Schema({
	avatar: {
		type: String,
		default: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
	},
  name: String,
	password: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date()
	},
	updated_at: {
		type: Date,
		default: Date()
	}
})
