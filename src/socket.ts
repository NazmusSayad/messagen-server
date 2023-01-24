import { Server } from 'socket.io'
import { onConnect } from './controller/auth/socketController'
import socketRoutes from './routes/socketRoute'

const io = new Server({ cors: { origin: '*' } })

const mainIo = io.of('/')
socketRoutes.setup(mainIo)

mainIo.on('connection', async (socket) => {
  onConnect(socket, (user) => {
    socket.join(user._id.toString())

    socket.onAny((ev: string, ...args: [any, Function]) => {
      if (ev.startsWith('$')) return
      socketRoutes.runSocket(socket, user, ev, ...args)
    })
  })
})

export default io
export { mainIo }
