const router = require('koa-router')()
const article = require('../controller/article')

router.prefix('/article')

router.get('/', article.index)
router.get('/myindex', article.myindex)
router.get('/show', article.show)
router.post('/create', article.create)
router.put('/update', article.update)
router.post('/praise', article.praise)
router.delete('/delete', article.del)

module.exports = router
