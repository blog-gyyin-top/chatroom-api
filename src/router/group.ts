import Router from 'koa-router'
import * as Group from '../controller/group'

const router = new Router({
  prefix: '/group'
})

router.post('/create', Group.createGroup)
router.post('/enter', Group.enterGroup)
router.get('/list', Group.getList)

export default router