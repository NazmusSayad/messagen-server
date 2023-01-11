import { Socket } from 'socket.io'
import { checkType } from 'express-master'
import User from '../../model/User'
import * as jwt from '../../utils/jwt'

export const onConnect = async (socket: Socket) => {
  try {
    const { authorization } = socket.handshake.auth
    checkType.string({ authorization })

    const { userId } = jwt.parseJwt(authorization)
    const user = await User.findOne({ _id: userId, verified: true })

    if (!user) throw new Error('404')
    socket.join(user._id.toString())
  } catch (err) {
    socket.disconnect(err.message)
  }
}
