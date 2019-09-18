const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new koa();
const router = new Router();

// 转换post请求的请求主体
app.use(bodyParser());

// 初始化controllers
require('./controllers.js')(router);

// 设置重定向
router.redirect('/', '/user/a');

// 注册路由
app.use(router.routes());

app.listen(3004);

console.log('server started in port: 3004 ');
