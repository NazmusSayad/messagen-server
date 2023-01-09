import { Response } from 'express'
import * as bcrypt from 'bcrypt'
import { UserRequest } from '../auth/tokenController'

export const getUser = (req: UserRequest, res: Response) => {
  res.success({ user: req.user.getSafeInfo() })
}

export const updateUser = async (req: UserRequest, res: Response) => {
  const reqBody = req.getBody('name')
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
  const code = crypto.randomUUID().split('-')[0]

  req.user.verificationCode = code
  req.user.pendingEmail = email
  await req.user.save()

  res.success({ message: `An otp code sent to your email: ${email}` })
}

export const updateEmail = async (req: UserRequest, res: Response) => {
  const isOk = await bcrypt.compare(req.body.code, req.user.verificationCode)
  if (!isOk) throw new ReqError("Code doesn't match")

  req.user.email = req.user.pendingEmail
  req.user.pendingEmail = undefined
  req.user.verificationCode = undefined

  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

export const updateUsername = async (req: UserRequest, res: Response) => {
  req.user.username = req.body.username
  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

export const updatePassword = async (req: UserRequest, res: Response) => {
  req.user.password = req.body.new_password
  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}
