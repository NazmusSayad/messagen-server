import { Request, Response } from 'express'
import { UserRequest } from './tokenController'
import crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import User from '../../model/User'
import { getEmailOrUsername } from '../../utils/user'

export const signup = async (req: UserRequest, res, next) => {
  const reqBody = req.getBody('name', 'username', 'email', 'password')
  const code = crypto.randomUUID().split('-')[0]
  const user = await User.create({ ...reqBody, verificationCode: code })

  req.user = user
  next()
}

export const resendAccVerifyCode = async (req: UserRequest, res: Response) => {
  req.user.verificationCode = crypto.randomUUID().split('-')[0]
  await req.user.save()
  res.success({ message: `An otp code sent to your email: ${req.user.email}` })
}

export const verifyAccount = async (req: UserRequest, res: Response) => {
  const { code } = req.body
  if (typeof code !== 'string') throw new ReqError('Please enter a valid code')

  const isOk = await bcrypt.compare(code, req.user.verificationCode)
  if (!isOk) throw new ReqError("Entered code doesn't matched!")

  req.user.verified = true
  req.user.verificationCode = undefined
  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

export const login = async (req: UserRequest, res, next) => {
  const { login, password } = req.body
  const user = await User.findOne(getEmailOrUsername(login))
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ReqError('Login failed!')
  }

  req.user = user
  next()
}

export const requestPassReset = async (req: Request, res: Response) => {
  const user = await User.findOne(getEmailOrUsername(req.body.login))
  if (user) {
    user.recoverCode = crypto.randomUUID().split('-')[0]
    await user.save()
  }

  res.success({
    message: 'Email sent to your account if given details are correct',
  })
}

export const resetPassword = async (req: Request, res, next) => {
  const { login, code, new_password } = req.body
  if (typeof code !== 'string') throw new ReqError('Please enter a valid code')

  const user = await User.findOne(getEmailOrUsername(login))
  if (!user || !(await bcrypt.compare(code, user.recoverCode))) {
    throw new ReqError("Entered details doesn't matched")
  }

  user.password = new_password
  user.recoverCode = undefined
  await user.save()
  next()
}
