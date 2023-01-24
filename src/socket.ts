import { Server } from 'socket.io'
import { checkType } from 'express-master'
import User from './model/User'
import socketRoutes from './routes/socketRoute'
import * as jwt from './utils/jwt'

const io = new Server({ cors: { origin: '*' } })

const mainIo = io.of('/')
socketRoutes.setup(mainIo)

mainIo.on('connection', async (socket) => {
  try {
    const { authorization } = socket.handshake.auth
    checkType.string({ authorization })

    const { userId } = jwt.parseJwt(authorization)
    const user = await User.findOne({ _id: userId, verified: true })
    if (!user) throw new Error('404')
    socket.emit('ok', true)

    socket.join(user._id.toString())
    socket.onAny((ev: string, ...args: [any, Function]) => {
      if (ev.startsWith('$')) return
      socketRoutes.runSocket(socket, user, ev, ...args)
    })
  } catch (err) {
    socket.disconnect(err.message)
  }
})

export default io
export { mainIo }
