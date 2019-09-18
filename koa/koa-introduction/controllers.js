/*自动注册 ./controllers 目录下的controller
 * @Author: zzh0211@live.com 
 * @Date: 2019-09-18 14:53:45 
 * @Last Modified by: hello
 * @Last Modified time: 2019-09-18 14:56:12
 */
const fs = require('fs');
const path = require('path');

// controller集中所在目录
const controllersPath = './controllers'

module.exports = (router)=>{
	// 读取controller目录内的文件名（包含文件夹）
	const files = fs.readdirSync(controllersPath);
	// 文件名转换成绝对路径
	const absoPathFiles = files.map(file=>path.resolve(controllersPath, file));
	// 过滤出文件（不包含文件夹）
	const plainFiles = absoPathFiles.filter(f=>fs.lstatSync(f).isFile());

	plainFiles.forEach(file=>{
		// 引入模块
		const ctrls = require(file);
		
		// 遍历controller中module.exports的键值对
		for(const [key, middleware] of Object.entries(ctrls)){
			// key的格式为： 'get /user/abc' ，按空格拆分，第一部分是请求方式，第二部分是请求地址
			const [method, rotuePath] = key.split(' ');
			// 往router上注册请求地址和中间件函数
			router[method.toLowerCase()](rotuePath, middleware);
		}
	});

	console.log(files, plainFiles);
};