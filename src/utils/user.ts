export const getEmailOrUsername = (login: string) => {
  if (!login) throw new ReqError('Login field not found!')
  return login.includes('@') ? { email: login } : { username: login }
}
