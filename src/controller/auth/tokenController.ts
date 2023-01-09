import { Response, Request, NextFunction } from 'express'
import nodeEnv from 'manual-node-env'
import * as jwt from '../../utils/jwt'
import User, { UserDocument } from '../../model/User'

export interface UserRequest extends Request {
  user: UserDocument
}

const cookieOptions: any = {
  secure: nodeEnv.isDev ? false : true,
  sameSite: 'strict',
  maxAge: 86400000 /* 1 day -> miliseconds */ * 30,
}

export const sendCookieToken = (req: UserRequest, res: Response) => {
  res.cookie('hasToken', true, cookieOptions)
  res.cookie('token', jwt.generateCookieJwt(req.user._id), {
    ...cookieOptions,
    httpOnly: true,
  })

  const token = jwt.generateUserJwt(req.user._id)
  res.success({ user: req.user.getSafeInfo(), token })
}

export const clearCookieToken = (req, res: Response) => {
  res.clearCookie('token')
  res.clearCookie('hasToken')
  res.status(204).end()
}

export const getAuthToken = async (req: UserRequest, res: Response, next) => {
  const { cookie } = jwt.parseJwt(req.cookies.token)
  const user = await User.findById(cookie)
  if (!user) throw new ReqError('No user found from your session', 401)
  req.user = user
  next()
}

const checkAuthFactory =
  (verified: boolean) => async (req: UserRequest, res, next) => {
    const { userId } = jwt.parseJwt(req.headers.authorization)
    const user = await User.findOne({ _id: userId, verified })

    if (!user) {
      throw new ReqError('No user found from your token', 401)
    }

    req.user = user
    next()
  }

export const checkAuthToken = checkAuthFactory(true)
export const checkAuthTokenNotVerified = checkAuthFactory(false)
