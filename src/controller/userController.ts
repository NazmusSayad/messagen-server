import * as bcrypt from 'bcrypt'
import { UserController } from './types'
import { checkEmailAvailability } from '../utils/user'
import { checkType } from 'express-master'
import User from '../model/User'

export const getUser: UserController = (req, res) => {
  res.success({ user: req.user.getSafeInfo() })
}

export const updateUser: UserController = async (req, res) => {
  const reqBody = req.getBody('name')
  checkType.optional.string({ name: reqBody.name })

  req.user.set(reqBody)
  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

export const deleteUser: UserController = async (req, res) => {
  await req.user.delete()
  res.status(204).end()
}

export const updateEmailRequest: UserController = async (req, res) => {
  const { email } = req.body
  checkType.string({ email })
  await checkEmailAvailability(email)

  const code = crypto.randomUUID().split('-')[0]
  req.user.verificationCode = code
  req.user.pendingEmail = email
  await req.user.save()

  res.success({ message: `An otp code sent to your email: ${email}` })
}

export const updateEmail: UserController = async (req, res) => {
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

export const updateUsername: UserController = async (req, res) => {
  const { username } = req.body
  checkType.string({ username })

  req.user.username = username
  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

export const updatePassword: UserController = async (req, res, next) => {
  const { new_password } = req.body
  checkType.string({ new_password })

  req.user.password = new_password
  await req.user.save()
  next()
}

export const searchUser: UserController = async (req, res) => {
  const { username } = req.query
  checkType.string({ username })

  const matchedUsers = await User.find({
    username: { $regex: username, $options: 'i' },
  })
    .select('name username avatar createdAt')
    .limit(20)
    .sort({ username: 1 })
    .lean()

  const result = []

  matchedUsers.forEach((user) => {
    if (user._id.toString() === req.user._id.toString()) {
      return
    }

    if (user.username === username) {
      result.unshift(user)
    }

    result.push(user)
  })

  res.success({ users: result })
}
