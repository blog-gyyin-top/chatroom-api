import Router from 'koa-router'
import jsonschema from 'jsonschema'
import { Group } from '../../../@types/group'
import { client  } from '../../config/db'
import { DB_TABLE, ERROR_STATUS } from '../../constants'

const router = new Router({
  prefix: '/group'
})
const validate = jsonschema.validate;
const group_tab = DB_TABLE.group;

router.post('/create', async function(ctx, next) {
  const params: Group.createParams = ctx.request.body;
  const model = client.from(group_tab)
  const res = validate(params, {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      password: {
        type: 'string'
      },
      description: {
        type: 'string'
      }
    },
    required: ['name', 'password', 'description']
  })
  if (!res.valid) {
    ctx.response.body = {
      ...ERROR_STATUS.PARAMS_INVALID
    }
    return next()
  }
  const now = Date.now()
  const ids = await model.insert({
    ...params,
    create_time: now,
    update_time: now
  })
  ctx.body = {
    code: 0,
    data: {
      id: ids[0]
    },
    message: 'success'
  }
})

router.post('/enter', async (ctx, next) => {
  const params: Group.enterParams  = ctx.request.body
  const res = validate(params, {
    type: 'object',
    properties: {
      id: {
        type: 'number'
      },
      password: {
        type: 'string'
      }
    },
    required: ['id', 'password']
  })
  if (!res.valid) {
    ctx.response.body = {
      ...ERROR_STATUS.PARAMS_INVALID
    }
    return next()
  }
  const model = client.from(group_tab)
  const record = await model.where({
    id: params.id
  }).first()
  if (!record) {
    ctx.body = {
      ...ERROR_STATUS.GROUP_NOT_EXIST
    }
    return next()
  }
  if (record.password !== params.password) {
    ctx.body = {
      ...ERROR_STATUS.PASSWORD_INCORRECT
    }
    return next()
  }
  ctx.body = {
    code: 0,
    message: 'success'
  }
})
export default router