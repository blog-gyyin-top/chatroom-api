
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
}

export const enterGroup = async (ctx: ParameterizedContext, next: Next) => {
  const user = ctx.state.user;
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
  const userGroupModel = client.from(user_group_tab)
  await userGroupModel.insert({
    user_id: user.id,
    group_id: params.id
  })
  ctx.body = {
    code: 0,
    message: 'success'
  }
}

export const getList = async (ctx: ParameterizedContext, next: Next) => {
  const db = client.from(group_tab)
  const model = db
    .leftJoin(
      user_group_tab,
      `${group_tab}.id`,
      `${user_group_tab}.group_id`
    )
  const records = await model
      .select(
        `${group_tab}.id`,
        `${group_tab}.name`,
        `${group_tab}.description`,
        `${group_tab}.create_time`
      )
  ctx.body = {
    code: 0,
    data: records
  }
}
export default router