import { Server } from 'socket.io'
import { checkType } from 'express-master'
import socketRoutes from './routes/socketRoute'
import * as jwt from './utils/jwt'
import { getErrorInfo } from 'req-error'

const io = new Server({
  cors: { origin: '*', credentials: true },
})

const mainIo = io.of('/')
socketRoutes.setup(mainIo)

mainIo.on('connection', async (socket) => {
  try {
    const { authorization } = socket.handshake.auth
    checkType.string({ authorization })

    const user = await jwt.parseUserFromToken(authorization, true)
    socket.join(user._id.toString())

    socket.emit('#ok', true)
    socket.onAny((ev: string, ...args: [any, Function]) => {
      socketRoutes.runSocket(socket, user, ev, ...args)
    })
  } catch (err) {
    socket.emit('#error', getErrorInfo(err)[0])
    socket.disconnect(true)
  }
})

export default io
export { mainIo }
