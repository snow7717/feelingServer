const router = require('koa-router')()
const friend = require('../controller/friend')

router.prefix('/friend')

router.get('/', friend.index)
router.get('/isfriend', friend.isfriend)
router.delete('/delete', friend.del)

module.exports = router