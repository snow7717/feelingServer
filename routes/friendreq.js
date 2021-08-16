const router = require('koa-router')()
const friendreq = require('../controller/friendreq')

router.prefix('/friendreq')

router.get('/', friendreq.index)
router.get('/count', friendreq.count)
router.get('/isrequested', friendreq.isrequested)
router.post('/deal', friendreq.deal)
router.delete('/delete', friendreq.del)

module.exports = router