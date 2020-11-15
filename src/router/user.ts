import Router from 'koa-router'
import * as User from '../controller/user'

const router = new Router({
  prefix: '/user'
})

router.post('/register', User.checkUserParams, User.registerUser)
router.post('/login', User.checkUserParams, User.login)

export default router