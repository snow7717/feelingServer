const router = require('koa-router')()
const file = require('../controller/file')

router.prefix('/file')

router.post('/upload', file.upload)

module.exports = router