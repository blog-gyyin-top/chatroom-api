import cookies from 'cookies'

export default (client) => {
  client.on('user-send-message', function(obj) {
    // const cookie = cookies.parse(client.request.headers.cookie);
  })
}