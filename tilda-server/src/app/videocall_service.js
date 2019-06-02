module.exports = ({ ws, sessions }) => ({
  call: () => ws.on('connection', (socket) => {
    console.log('#connect')
    socket.user = {}

    socket.on('register', (id) => {
      console.log('id', id);
      if (!id || id.length < 3) {
        return socket.emit('reg-result', { result: 0, message: 'id must be at least 3 character' })
      }

      socket.user.id = id

      // check existing connection
      if (!sessions[id]) { // host
        socket.user.isHost = true
        sessions[id] = { host: socket.user, hostSocket: socket }
        socket.emit('reg-result', { result: 1 })
      } else { // client
        socket.user.isHost = false
        sessions[id].remote = socket.user
        sessions[id].remoteSocket = socket
        socket.emit('reg-result', { result: 2, host: sessions[id].host })
      }
    });

    socket.on('sdp', function (desc) {
      console.log('% sdp', socket.user.id, !!desc)
      socket.user.desc = desc
      if (getPartner()) {
        getPartner().emit('sdp', desc)
      }
    })
  
    socket.on('ice-new', function (ice) {
      console.log('% ice', socket.user.id, !!ice)
      socket.user.ice = ice
      if (getPartner()) {
        getPartner().emit('ice-new', ice)
      }
    })
  
    socket.on('disconnect', function () {
      console.log('* disconnect', socket.user.id, socket.user.isHost)
  
      if (getPartner()) {
        getPartner().emit('partner-disconnected', 1)
      }
  
      delete sessions[socket.user.id]
    })
  
    function getPartner() {
      if (!sessions[socket.user.id]) return false
  
      if (socket.user.isHost && sessions[socket.user.id].remoteSocket) {
        return sessions[socket.user.id].remoteSocket
      } else if (!socket.user.isHost && sessions[socket.user.id].hostSocket) {
        return sessions[socket.user.id].hostSocket
      }
      return false
    }
  }),
});
