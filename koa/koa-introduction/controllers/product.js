/*product相关controller
 * @Author: zzh0211@live.com 
 * @Date: 2019-09-18 14:42:30 
 * @Last Modified by: hello
 * @Last Modified time: 2019-09-18 14:57:09
 */
// 中间件，必须是异步函数，提供给 new koa().use(异步中间件函数) 使用的
async function list(ctx, next){
	ctx.body = '产品列表';
	await next();
}

module.exports = {
	// 格式约束： 'http请求方式 url': middleware
	'get /product/list': list,
};