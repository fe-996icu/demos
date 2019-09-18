// 引入koa
const koa = require('koa');
// 引入koa-router
const Router = require('koa-router');
// koa-bodyparser作用是转换post请求的request body内容
const bodyParser = require('koa-bodyparser');

// 实例化koa
const app = new koa();

// 实例化koa-router
const router = new Router();

// get请求 '/' ，返回一段form表单
router.get('/', async (ctx, next)=>{
	// form表单提交方式为post
	ctx.body = `
		<form method="post" action="/b">
			<input name="name" />
			<input name="pwd"/>
			<input type="submit" value="提交" />
		</form>
	`;

	await next();
});

router.post('/b', async (ctx, next)=>{
	// 设置response body内容
	ctx.body = `{"d":3,"e":4}`;
	// 设置response content-type
	ctx.type = 'application/json';

	// 输出request body中的内容（koa-bodyparser已经转换成json对象）
	console.log('输出request body中的内容', ctx.request.body);

	const {
		name='无名称',
		pwd='无密码',
	} = ctx.request.body;

	console.log(`名称：${ name } , 密码：${ pwd }`);
});

// 使用koa-bodyparser中间件
app.use(bodyParser());
// 使用koa-router中间件
app.use(router.routes());

// 监听端口号
app.listen(3003);

console.log('server started in port: 3003');