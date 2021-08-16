const router = require('koa-router')()
const message = require('../controller/message')

router.prefix('/message')

router.get('/', message.index)
router.get('/chatindex', message.chatIndex)
router.put('/setread', message.setRead)
router.delete('/delchat', message.delchat)

module.exports = router