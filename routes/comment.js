const router = require('koa-router')()
const comment = require('../controller/comment')

router.prefix('/comment')

router.get('/', comment.index)
router.get('/myindex', comment.myindex)
router.post('/create', comment.create)
router.post('/praise', comment.praise)
router.delete('/delete', comment.del)

module.exports = router
