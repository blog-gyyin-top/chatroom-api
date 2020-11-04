import knex from 'knex'

export const client = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'chatroom'
  }
})

