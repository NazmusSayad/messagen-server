import { checkType } from 'express-master'
import User from '../model/User'

export const getQueryFromLoginAndPass = (login: string) => {
  checkType.string({ login })
  return { [login.includes('@') ? 'email' : 'username']: login }
}

export const checkEmailAvailability = async (email: string) => {
  const isExists = await User.exists({
    $or: [{ email }, { pendingEmail: email }],
  })
  if (isExists) {
    throw new ReqError('This email already exists')
  }
}
