const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const parameter = require('koa-parameter')
const logger = require('koa-logger')
const mongo = require('./database')()
const Redis = require('ioredis')
const cors = require('koa2-cors')
const koajwt = require('koa-jwt')
const koaBody = require('koa-body')
const path = require('path')
const socket = require('./socket')
const token = require('./controller/token')

const index = require('./routes/index')
const file = require('./routes/file')
const admins = require('./routes/admins')
const user = require('./routes/user')
const article = require('./routes/article')
const comment = require('./routes/comment')
const message = require('./routes/message')
const friendreq = require('./routes/friendreq')
const friend = require('./routes/friend')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(parameter(app))
app.use(json())
app.use(logger())
app.use(cors())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 中间件对token进行验证
app.use(async (ctx, next) => {
  return next().catch((err) => {
    if (err.status == 401) {
      ctx.body = {
        code: 401,
				success: false,
        message: '用户认证失败,请确认您是否已经登录'
      }
    } else {
      throw err
    }
  })
})

app.use(async (ctx, next) => {
	let exempts = [
		'/admins/login',
		'/user\/register',
		'/user\/login',
		'/user\/show',
		'/article',
		'/comment'
	]
	if(exempts.indexOf(ctx.path) == -1) {
		let data = await token.verify(ctx, next)
		if(data.length > 0) {
			await next()
		}else{
			ctx.body = {
				code: 422,
				success: false,
				message: '您的账号在别的地方登录,您已被迫下线'
			}
		}
	}else{
		await next()
	}
})

app.use(koajwt({
	secret: 'xshusnow',
}).unless({
	path: [
		/^\/admins\/login/,
		/^\/user\/register/,
		/^\/user\/login/,
		/^\/user\/show/,
		/^\/user/,
		/^\/article/,
		/^\/comment/
	]
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
})

//cors
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(admins.routes(), admins.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(article.routes(), article.allowedMethods())
app.use(comment.routes(), comment.allowedMethods())
app.use(message.routes(), message.allowedMethods())
app.use(friendreq.routes(), friendreq.allowedMethods())
app.use(friend.routes(), friend.allowedMethods())

// 文件上传
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024
  }
}))
app.use(file.routes(), file.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
