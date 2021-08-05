function randomString(len) {
  len = len || 32
  let $chars = 'abcdefghijklmnopqrstuvwxyz123456789'
  let maxPos = $chars.length
  let str = ''
  for (i = 0; i < len; i++) {
  　str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
 return str
}

module.exports = randomString