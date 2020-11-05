import Router from 'koa-router'
import crypto from 'crypto'
import jsonschema from 'jsonschema'

import { client } from '../../config/db'
import { DB_TABLE, STATUS } from '../../constants'
import { User } from '../../../@types/user'
import { SALT } from '../../constants'
import { sign } from '../../utils/jwt'

const router = new Router({
  prefix: '/api'
});
const validate = jsonschema.validate;
const user_tab = DB_TABLE.user;

const checkUserParams = (ctx, next) => {
  const params: User.registerParams = ctx.request.body;
  const res = validate(params, {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    required: ['name', 'password']
  })
  if (!res.valid) {
    ctx.response.body = STATUS.PARAMS_INVALID
  }
  return next()
}
router.post('/register', checkUserParams, async function(ctx, next) {
  const params: User.registerParams = ctx.request.body;
  const table = client.from(user_tab);
  const md5 = crypto.createHash('md5')
  const now = Date.now() / 1000
  // 密码加盐储存
  md5.update(params.name + SALT + params.password)
  try {
    const id = await table.insert({
      name: params.name,
      password: md5.digest('hex'),
      create_time: now,
      update_time: now
    })
    ctx.response.body = {
      code: 0,
      message: 'Success',
      data: {
        id: id[0]
      }
    }
  } catch (err) {
    ctx.throw(500, err.message)
  }
})
router.post('/login', checkUserParams, async function(ctx, next) {
  const params: User.registerParams = ctx.request.body;
  const table = client.from(user_tab);
  const md5 = crypto.createHash('md5')
  // 密码加盐储存
  md5.update(params.name + SALT + params.password)
  const encryPassword = md5.digest('hex');
  const user = await table.select("*").where({
    name: params.name
  }).first();
  if (!user) {
    ctx.response.body = STATUS.USER_NOT_EXIST
    return next()
  }
  if (user.password !== encryPassword) {
    ctx.response.body = STATUS.PASSWORD_INCORRECT
    return next()
  }
  // jwt 生成 token
  const token = sign(params)
  ctx.cookies.set('a-token', token, {
    domain: '',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    overwrite: true
  })
  ctx.response.body = {
    code: 0,
    message: 'login success'
  }
})
router.get('/user/:id', function() {

})

export default router