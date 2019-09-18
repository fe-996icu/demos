// 导入koa
const Koa = require('koa');

// 创建一个koa对象表示web app本身:
const app = new Koa();

// 输出请求地址的middleware
app.use(async (ctx, next)=>{
	console.log(`请求url是：${ ctx.request.url }`);
	await next();
});

// 请求地址为 `/b` ，禁止访问
app.use(async (ctx, next)=>{
	if(ctx.url == '/b'){
		// 设置http状态码
		ctx.status = 444;
		// 设置response body
		ctx.body = '无权限';

		// 读取cookies
		console.log(ctx.cookies);
	}

	// 此处不调用next就不会在执行后续 middleware 中间件（app.use()）
	next();
});

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next)=>{
	// 记录开始时间
	const startTime = Date.now();

	await next();
	
	// 设置response的content-type
	ctx.response.type = 'text/html';
	// 设置response body
	ctx.response.body = '<span>Hello, koa2!</span>';

	// 计算执行时间
	console.log('执行时间：', Date.now() - startTime);
});

/**middleware中间件的顺序很重要，next会按照 app.use() 的顺序调用 */
app.use(async (ctx, next)=>{
	console.log('又一个middleware：：：');

	setTimeout(async () => {
		console.log('第三个middleware。。。');
		await next();
	}, 200);

	console.log('有两个middleware！！！');
});

// 在端口3000监听:
app.listen(3003);

console.log('app started at port 3000...');
