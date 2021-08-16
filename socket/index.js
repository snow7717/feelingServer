const Koa = require('koa')
const app = new Koa()
const IO = require('koa-socket')
const io = new IO()
const msocket = require('../models/socket')
const message = require('../models/message')
const friendreq = require('../models/friendreq')

io.attach(app)
app._io.on('connection', socket => {
	socket.on('disconnect', () => {
		console.log("客户端已经断开连接")
	})
})
io.on('login', async (receive) => {
	if(receive.data.user) {
		await msocket.create({socket: receive.socket.id, user: receive.data.user}).then((data) => {
		}).catch(err => {
			console.error(err)
		})
	}
})
io.on('friendreq', async (receive) => {
	await friendreq.create(receive.data).then(async (data) => {
		let count = await friendreq.find({to: receive.data.to, status: '待验证'}).countDocuments().exec()
		await msocket.find({user: receive.data.to}).then((data1) => {
			for(let item of data1) {
				if (app._io.sockets.connected[item.socket]) {
					console.log('发送成功')
					app._io.sockets.connected[item.socket].emit('friendreq',{count: count})
				}
			}
		})
	})
})
io.on('message', async (receive) => {
	await message.create(receive.data).then(async (data) => {
		if(data) {
			let unread = await message.find({to: receive.data.to,read: false}).countDocuments().exec()
			await msocket.find({user: receive.data.to}).then((data1) => {
				for(let item of data1) {
					if (app._io.sockets.connected[item.socket]) {
						app._io.sockets.connected[item.socket].emit('message',{from: receive.data.from, to: receive.data.to, unread: unread, content: receive.data.content,read: false,deletes: []})
					}
				}
			})
		}
	}).catch(err => {
		console.log(err)
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