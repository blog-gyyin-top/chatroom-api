
import { ParameterizedContext, Next } from 'koa'
import Router from 'koa-router'
import jsonschema from 'jsonschema'
import { Group } from '../../../@types/group'
import { client  } from '../../config/db'
import { DB_TABLE, ERROR_STATUS } from '../../constants'
import { verify } from '../../middleware/auth'

const router = new Router({
  prefix: '/group'
})
router.use(verify)
const validate = jsonschema.validate;
const group_tab = DB_TABLE.group;
const user_group_tab = DB_TABLE.user_group
const message_tab = DB_TABLE.group_message

export const createGroup = async (ctx: ParameterizedContext, next: Next) => {
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
  const now = Date.now() / 1000
  const ids = await model.clone().insert({
    ...params,
    create_time: now,
    update_time: now
  });
  const id = ids[0]
  const group = await model.clone().where({
    id: id
  }).first()
  const { password, ...data } = group
  ctx.body = {
    code: 0,
    data: data,
    message: 'success'
  }
}

export const enterGroup = async (ctx: ParameterizedContext, next: Next) => {
  const user = ctx.state.user;
  const params: Group.enterParams  = ctx.request.body
  console.log('params', params)
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
  const userGroupModel = client.from(user_group_tab)
  await userGroupModel.insert({
    user_id: user.id,
    group_id: params.id
  })
  const { password, ...data } = record
  ctx.body = {
    code: 0,
    message: 'success',
    data: data
  }
}

export const getList = async (ctx: ParameterizedContext, next: Next) => {
  const db = client.from(group_tab)
  const records = await db
      .select('*').orderBy('create_time', 'desc')

  ctx.body = {
    code: 0,
    data: records,
    message: 'success'
  }
}

export const getMessage = async (ctx: ParameterizedContext, next: Next) => {
  const params = ctx.request.query;
  const group_id = params.group_id;
  const db = client.from(message_tab);
  if (!group_id) {
    ctx.response.body = {
      ...ERROR_STATUS.PARAMS_INVALID
    }
    return next()
  }
  const records = await db.where({
    group_id
  }).orderBy('create_time', 'desc')
  ctx.body = {
    code: 0,
    data: records
  }
}
export default router