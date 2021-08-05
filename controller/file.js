const path = require('path')
const OSS = require('ali-oss')
const randomstring = require('./util/randomstring')

let client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI5tLSWtCr6r4dZ3xCcYBk',
  accessKeySecret: 'hrHoQRMPwDVPkIgfbTJwWEMAjpEWNg',
	bucket: 'feelingbar'
})

async function upload(ctx, next) {
	let [dir,file] = [
		ctx.request.header.dirname,
		ctx.request.files.file
	]
	file.name = randomstring(20) + path.extname(file.name)
	let result = await client.put(`${dir}/${file.name}`, file.path)
	if(result.res.statusCode == 200) {
		ctx.body = {
			success: true,
			message: '上传成功',
			data: result
		}
	}else{
		ctx.body = {
			success: false,
			message: '上传失败'
		}
	}
}

module.exports = {
	upload
}