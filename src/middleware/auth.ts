import { ParameterizedContext, Next } from 'koa'
import { decode } from '../utils/jwt'
import { ERROR_STATUS } from '../constants'

export const verify = (ctx: ParameterizedContext, next: Next) => {
  const token = ctx.cookies.get('token')
  try {
    const user = decode(token!)
    if (!user) {
      throw new Error('user does not login')
    }
    ctx.state.user = user
    return next()
  } catch (err) {
    ctx.body = {
      code: ERROR_STATUS.USER_NOT_LOGIN.code,
      message: err.message
    }
  }
}