import Koa from 'koa'
import json from 'koa-json'
import Router from 'koa-router'
import koaStatic from 'koa-static'
import path from 'path'
import logger from 'koa-logger'
import koaBody from 'koa-bodyparser'
import { koaSwagger } from 'koa2-swagger-ui'
import swagger from './utils/swagger'

import user from './router/user'
import group from './router/group'

const app = new Koa()
const router = new Router({
  prefix: '/api'
})

app.use(json())
app.use(koaBody())
app.use(logger())
app.use(koaStatic(path.resolve(__dirname, './assets')))
app.use(koaSwagger({
  routePrefix: '/api/swagger',
  swaggerOptions: {
    url: '/swagger.json'
  }
}))

app.use(swagger.routes())
router.use(user.routes(), user.allowedMethods())
router.use(group.routes(), group.allowedMethods())

app.listen(3000, function() {
  console.log('server is running on port 3000')
})