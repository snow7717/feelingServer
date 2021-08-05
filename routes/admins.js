const router = require('koa-router')()
const admin = require('../controller/admin')

router.prefix('/admins')

router.post('/login', admin.login)
router.get('/', admin.verify, admin.index)
router.get('/showself',admin.showself)
router.get('/show', admin.verify, admin.show)
router.post('/create', admin.verify, admin.create)
router.post('/edit', admin.edit)
router.put('/update', admin.verify, admin.update)
router.delete('/delete', admin.verify, admin.del)

module.exports = router
