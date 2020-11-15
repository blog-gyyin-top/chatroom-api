import jwt from 'jsonwebtoken'

const secret = 'db46300d-1f97-4fb7-a1ed-3db5e3bb07b0'

export const sign = (payload: {
  name: string
  password: string
}) => {
  return jwt.sign(
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 1000
    },
    secret
  )
}

export const verify = (token: string) => {
  return jwt.verify(token, secret)
}

export const decode = (token: string) => {
  return jwt.decode(token)
}