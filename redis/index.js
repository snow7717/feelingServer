const Redis = require('ioredis')
const redis = new Redis({
  host: '127.0.0.1',
	//存诸前缀
  prefix: 'snow:',
	//过期时间
  ttl: 60 * 60 * 23,
  db: 0
})

module.exports = redis