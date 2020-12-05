import Router from 'koa-router'

import group from './group'
import user from './user'

const router = new Router({
  prefix: '/api'
})

router.use(group.routes())
router.use(user.routes())

export default router