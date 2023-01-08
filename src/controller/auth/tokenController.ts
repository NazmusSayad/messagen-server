import { Response, Request, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import User from '../../model/User'
import { UserType } from '../../model/userSchema'

export interface UserRequest extends Request {
  user: UserType
}

export const saveToken = (req: UserRequest, res: Response) => {
  res.cookie('token', generate(req.user?._id), {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 2592000000),
  })

  res.cookie('hasToken', true, {
    expires: new Date(Date.now() + 2592000000),
  })

  res.success({ token: true })
}

export const checkAuth = async (req: UserRequest, res, next: NextFunction) => {
  const userId = verify(req.cookies.token)
  const user = await User.findById(userId)

  if (!user) {
    throw new ReqError('User not found!', 401)
  }

  req.user = user
  next()
}

export const clearToken = (req, res: Response) => {
  res.clearCookie('token')
  res.clearCookie('hasToken')
  res.status(204).end()
}

const generate = (data) => {
  return jsonwebtoken.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  })
}

const verify = (token) => {
  const tokenInfo = jsonwebtoken.verify(token, process.env.JWT_SECRET)
  const currentTime = Math.floor(Date.now() / 1000)
  if (tokenInfo.exp <= currentTime) {
    throw new ReqError('errorMessages.auth.jwtExpire')
  }
  return tokenInfo.data
}
