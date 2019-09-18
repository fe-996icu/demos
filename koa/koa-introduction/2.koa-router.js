// 引入koa
const koa = require('koa');
// 引入koa-router，方便
const Router = require('koa-router');

// 实例化一个koa对象
const app = new koa();

// 实例化一个koa-router对象
const router = new Router();

// 监听get请求地址： '/' ，执行下面的函数
router.get('/', async (ctx, next)=>{
	// ctx.body === ctx.response.body
	// 返回html片段，form表单提交到 '/b' 地址
	ctx.body = `
		<form method="post" action="/b">
			<input name="name" />
			<input name="pwd"/>
			<input type="submit" value="提交" />
		</form>
	`;

	await next();
});

// 监听get请求 '/a' ，执行下面的函数
router.get('/a', async (ctx, next)=>{
	ctx.body = `<span>啊啊啊</span>`;
	next();
});

// 监听post请求 '/b'
router.post('/b', async (ctx, next)=>{
	// response body为一段json字符串
	ctx.body = `{"d":3,"e":4}`;
	// ctx.type === ctx.response.type，设置response content-type为json
	ctx.type = 'application/json';

	// 打印response body内容，因为没有用koa-bodyparser，所以body为undefined
	console.log(ctx.request.body);
});

// 使用middleware中间件
app.use(router.routes());

// 监听端口号
app.listen(3003);

console.log('server started in port: 3003');