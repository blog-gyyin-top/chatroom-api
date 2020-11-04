import Router from 'koa-router' //引入路由函数
import swaggerJSDoc from 'swagger-jsdoc'

const router = new Router()

const swaggerDefinition = {
  info: {
    title: 'API',
    version: '1.0.0',
    description: 'API',
  },
  host: 'localhost:3000',
  basePath: '/' // Base path (optional)
};

const options = {
  swaggerDefinition,
  apis: ['./router/*.js'], // 写有注解的router的存放地址
};

const swaggerSpec = swaggerJSDoc(options)

// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
})

export default router