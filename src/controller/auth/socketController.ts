import { Socket } from 'socket.io'
import { checkType } from 'express-master'
import User from '../../model/User'
import * as jwt from '../../utils/jwt'
import { UserType } from '../../model/userSchema'

export const onConnect = async (
  socket: Socket,
  start: (user: UserType) => void
) => {
  try {
    const { authorization } = socket.handshake.auth
    checkType.string({ authorization })

    const { userId } = jwt.parseJwt(authorization)
    const user = await User.findOne({ _id: userId, verified: true })

    if (!user) throw new Error('404')
    start(user)
  } catch (err) {
    socket.disconnect(err.message)
  }
}
