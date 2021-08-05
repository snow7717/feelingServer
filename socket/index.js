const Koa = require('koa')
const app = new Koa()
const IO = require('koa-socket')
const io = new IO()
const msocket = require('../models/socket')
const message = require('../models/message')

io.attach(app)
app._io.on('connection', socket => {
	console.log('客户端建立连接')
	socket.on('disconnect', () => {
		console.log("客户端已经断开连接")
	})
})
io.on('login', async (receive) => {
	await msocket.create({socket: receive.socket.id, user: receive.data.user}).then((data) => {
	}).catch(err => {
		console.error(err)
	})
})
io.on('message', async (receive) => {
	await message.create(receive.data).then((data) => {
	}).catch(err => {
		console.log(err)
	})
	let unread = await message.find({to: receive.data.to,read: false}).countDocuments().exec()
	await msocket.find({user: receive.data.to}).then((data) => {
		for(let item of data) {
			if (app._io.sockets.connected[item.socket]) {
				app._io.sockets.connected[item.socket].emit('message',{unread: unread, content: receive.data.content})
			}
		}
	})
})
io.on('remove', async (receive) => {
	await msocket.deleteMany({user: receive.data.user},(err, data) => {
		if(err) {
			console.error(err)
		}
	})
})
app.listen( process.env.PORT || 3001 )

module.exports = app