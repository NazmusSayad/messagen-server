import * as jwt from '../../utils/jwt'
import { mainIo } from '../../socket'
import { UserController } from '../types'
import { checkType } from 'express-master'

export const sendCookieToken: UserController = (req, res) => {
  res.cookie('cookieToken', jwt.generateCookieToken(req.user), {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 86400000 /* 1 day -> miliseconds */ * 30,
  })

  const token = jwt.generateAuthToken(req.user)
  res.success({ user: req.user.getSafeInfo(), token })
}

export const clearCookieToken: UserController = (req, res) => {
  res.clearCookie('cookieToken')
  res.status(204).end()
}

export const getAuthToken: UserController = async (req, res, next) => {
  const { cookieToken } = req.cookies
  checkType.string({ cookieToken }, { statusCode: 401 })
  req.user = await jwt.parseUserFromCookie(cookieToken)
  next()
}

const checkAuthFactory =
  (isVerified: boolean): UserController =>
  async (req, res, next) => {
    const { authorization, socketid } = req.headers
    checkType.string({ authorization }, { statusCode: 401 })

    const user = await jwt.parseUserFromToken(authorization, isVerified)
    const sockets = mainIo.to(user._id.toString()).except(socketid)

    req.user = user
    req.io = {
      send: sockets.emit,
      disconnect: sockets.disconnectSockets,
      sendTo(ev, rooms, data) {
        mainIo.to(rooms).to(user._id.toString()).except(socketid).emit(ev, data)
      },
    }

    next()
  }

export const checkAuthToken = checkAuthFactory(true)
export const checkAuthTokenNotVerified = checkAuthFactory(false)
