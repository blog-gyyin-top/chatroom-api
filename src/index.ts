import Koa from 'koa'
import json from 'koa-json'
import http from 'http'
import { Server } from 'socket.io'
import koaStatic from 'koa-static'
import path from 'path'
import logger from 'koa-logger'
import koaBody from 'koa-bodyparser'
import { koaSwagger } from 'koa2-swagger-ui'
import swagger from './utils/swagger'
import router from './router'
import socket from './controller/socket'

const app = new Koa()
const server = http.createServer(app.callback())
const io = new Server(server)

io.on('connection', socket)

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
app.use(router.routes())

app.listen(3000, function() {
  console.log('server is running on port 3000')
})