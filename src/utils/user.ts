import { checkType } from 'express-master'

export const getQueryFromLoginAndPass = (login: string) => {
  checkType.string({ login })
  return { [login.includes('@') ? 'email' : 'username']: login }
}
