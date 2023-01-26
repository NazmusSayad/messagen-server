import { checkType } from 'express-master'
import nodeEnv from 'manual-node-env'
import * as jwt from '../../utils/jwt'
import { mainIo } from '../../socket'
import { UserController } from '../types'

const cookieOptions: any = {
  secure: !nodeEnv.isDev,
  sameSite: 'strict',
  maxAge: 86400000 /* 1 day -> miliseconds */ * 30,
}

export const sendCookieToken: UserController = (req, res) => {
  res.cookie('hasToken', true, cookieOptions)
  res.cookie('token', jwt.generateCookieToken(req.user), {
    ...cookieOptions,
    httpOnly: true,
  })

  const token = jwt.generateAuthToken(req.user)
  res.success({ user: req.user.getSafeInfo(), token })
}

export const clearCookieToken: UserController = (req, res) => {
  res.clearCookie('token')
  res.clearCookie('hasToken')
  res.status(204).end()
}

export const getAuthToken: UserController = async (req, res, next) => {
  const { token } = req.cookies
  checkType.string({ token })
  req.user = await jwt.parseUserFromCookie(token)
  next()
}

const checkAuthFactory =
  (isVerified: boolean): UserController =>
  async (req, res, next) => {
    const { authorization, socketid } = req.headers
    checkType.string({ authorization })

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
