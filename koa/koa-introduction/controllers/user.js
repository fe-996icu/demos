/*user相关controller
 * @Author: zzh0211@live.com 
 * @Date: 2019-09-18 14:42:44 
 * @Last Modified by: hello
 * @Last Modified time: 2019-09-18 14:47:55
 */
// 中间件，必须是异步函数，提供给 new koa().use(异步中间件函数) 使用的
const fn = async (ctx, next)=>{
	ctx.body = JSON.stringify({
		a: 123,
		b: 234,
		c: {
			d: 345,
		}
	});
	await next()
};


module.exports = {
	'GET /user/a': fn,
};