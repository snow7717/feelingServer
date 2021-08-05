const router = require('koa-router')()
const message = require('../controller/message')

router.prefix('/message')

router.get('/', message.index)

module.exports = router