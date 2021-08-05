const router = require('koa-router')()
const user = require('../controller/user')

router.prefix('/user')

router.post('/register', user.register)
router.post('/login', user.login)
router.put('/update', user.update)

module.exports = router
