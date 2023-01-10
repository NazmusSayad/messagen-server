import { checkType } from 'express-master'

export const getEmailOrUsername = (login: string) => {
  checkType.string({ login })
  return login.includes('@') ? { email: login } : { username: login }
}
