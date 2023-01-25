import { Response } from 'express'
import { checkType } from 'express-master'
import * as bcrypt from 'bcrypt'
import { UserRequest } from './auth/tokenController'

export const getUser = (req: UserRequest, res: Response) => {
  res.success({ user: req.user.getSafeInfo() })
}

export const updateUser = async (req: UserRequest, res: Response) => {
  const reqBody = req.getBody('name')
  checkType.optional.string({ name: reqBody.name })

  req.user.set(reqBody)
  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

export const deleteUser = async (req: UserRequest, res: Response) => {
  await req.user.delete()
  res.status(204).end()
}

export const updateEmailRequest = async (req: UserRequest, res: Response) => {
  const { email } = req.body
  checkType.string({ email })
  const code = crypto.randomUUID().split('-')[0]

  req.user.verificationCode = code
  req.user.pendingEmail = email
  await req.user.save()

  res.success({ message: `An otp code sent to your email: ${email}` })
}

export const updateEmail = async (req: UserRequest, res: Response) => {
  const { code } = req.body
  checkType.string({ code })

  const isOk = await bcrypt.compare(code, req.user.verificationCode)
  if (!isOk) throw new ReqError("Code doesn't match")

  req.user.email = req.user.pendingEmail
  req.user.pendingEmail = undefined
  req.user.verificationCode = undefined

  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

export const updateUsername = async (req: UserRequest, res: Response) => {
  const { username } = req.body
  checkType.string({ username })

  req.user.username = username
  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

export const updatePassword = async (req: UserRequest, res: Response, next) => {
  const { new_password } = req.body
  checkType.string({ new_password })

  req.user.password = new_password
  await req.user.save()
  next()
}
