import Koa from 'koa'
import json from 'koa-json'
import KoaRouter from 'koa-router'
import logger from 'koa-logger'
import koaBody from 'koa-bodyparser'


const app = new Koa()
const router = new KoaRouter()

app.use(json())
app.use(koaBody())
app.use(logger())

app.use(router.routes())

app.listen(3000, function() {
  console.log('server is running on port 3000')
})