import Koa from 'koa'
import json from 'koa-json'
import KoaRouter from 'koa-router'
import logger from 'koa-logger'
import koaBody from 'koa-bodyparser'
import { koaSwagger } from 'koa2-swagger-ui'
import swagger from './utils/swagger'

import user from './router/user'

const app = new Koa()
const router = new KoaRouter()

app.use(json())
app.use(koaBody())
app.use(logger())
app.use(koaSwagger({
  routePrefix: '/swagger',
  swaggerOptions: {
    url: '/swagger.json'
  }
}))

router.get('/test', function() {
  console.log('this is test')
})
app.use(router.routes()).use(router.allowedMethods())
app.use(user.routes()).use(router.allowedMethods())
app.use(swagger.routes())

app.listen(3000, function() {
  console.log('server is running on port 3000')
})