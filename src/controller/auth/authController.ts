import crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { checkType } from 'express-master'
import User from '../../model/User'
import { UserController } from '../types'
import { updateAvatarFromReq } from '../user/utils'
import {
  checkEmailAvailability,
  getQueryFromLoginAndPass,
} from '../../utils/user'

export const signup: UserController = async (req, res, next) => {
  const reqBody = req.getBody('name', 'username', 'email', 'password')
  checkType.string(reqBody)
  await checkEmailAvailability(reqBody.email)

  const code = crypto.randomUUID().split('-')[0]
  const user = new User({
    ...reqBody,
    verificationCode: code,
  })

  await updateAvatarFromReq(user, req)
  await user.save()
  req.user = user
  next()
}

export const resendAccVerifyCode: UserController = async (req, res) => {
  req.user.verificationCode = crypto.randomUUID().split('-')[0]
  await req.user.save()
  res.success({ message: `An otp code sent to your email: ${req.user.email}` })
}

export const verifyAccount: UserController = async (req, res) => {
  const { code } = req.body
  checkType.string({ code })

  const isOk = await bcrypt.compare(code, req.user.verificationCode)
  if (!isOk) throw new ReqError("Entered code doesn't matched!")

  req.user.isVerified = true
  req.user.verificationCode = undefined
  await req.user.save()

  res.success({ user: req.user.getSafeInfo() })
}

export const login: UserController = async (req, res, next) => {
  const { login, password } = req.body
  checkType.string({ login, password })

  const user = await User.findOne(getQueryFromLoginAndPass(login))
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ReqError('Login failed!')
  }

  req.user = user
  next()
}

export const requestPassReset: UserController = async (req, res) => {
  const { login } = req.body
  checkType.string({ login })

  const user = await User.findOne(getQueryFromLoginAndPass(login))
  if (user) {
    user.recoverCode = crypto.randomUUID().split('-')[0]
    await user.save()
  }

  res.success({
    message: 'Email sent to your account if given details are correct',
  })
}

export const resetPassword: UserController = async (req, res, next) => {
  const { login, code, new_password } = req.body
  checkType.string({ login, code, new_password })

  const user = await User.findOne(getQueryFromLoginAndPass(login))
  if (
    !(
      user &&
      user.recoverCode &&
      (await bcrypt.compare(code, user.recoverCode))
    )
  ) {
    throw new ReqError("Entered details doesn't matched")
  }

  user.password = new_password
  user.recoverCode = undefined
  req.user = await user.save()
  next()
}

export const checkPassword: UserController = async (req, res, next) => {
  const { password } = req.body
  checkType.string({ password })

  const isOk = await bcrypt.compare(password, req.user.password)
  if (!isOk) {
    throw new ReqError('Please enter the right password')
  }

  next()
}
