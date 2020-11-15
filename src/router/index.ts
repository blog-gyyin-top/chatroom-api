import Router from 'koa-router'

import group from './group'
import user from './user'

const router = new Router({
  prefix: '/api'
})

router.use(group.routes(), group.allowedMethods())
router.use(user.routes(), user.allowedMethods())

export default router