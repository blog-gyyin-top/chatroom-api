export const DB_TABLE = {
  user: 'user',
  group_message: 'group_message',
  group: 'group',
  user_group: 'user_group'
}

export const SALT = "hhug6dcKyCNBQ5sUC0i6hja5dCTqdSzV"

export const ERROR_STATUS = {
  PARAMS_INVALID: {
    code: 10000,
    message: 'params are invalid'
  },
  USER_NOT_EXIST: {
    code: 10001,
    message: 'user does not exist',
  },
  PASSWORD_INCORRECT: {
    code: 10002,
    message: 'password is incorrect'
  },
  GROUP_NOT_EXIST: {
    code: 10003,
    message: 'group does not exist'
  }
}