import jsonwebtoken from 'jsonwebtoken'
import User from '../model/User'
const jwtTokenPrefix = 'Bearer '
const error = new ReqError('Invalid token')

export const generateJwt = (data, expiresIn = '90d') => {
  return jsonwebtoken.sign({ data }, process.env.JWT_SECRET, { expiresIn })
}

export const parseJwt = (token: string) => {
  if (!token || typeof token !== 'string') throw error
  if (token.startsWith(jwtTokenPrefix)) {
    token = token.slice(jwtTokenPrefix.length)
  }

  const tokenInfo = jsonwebtoken.verify(token, process.env.JWT_SECRET)
  const currentTime = Math.floor(Date.now() / 1000)
  if (tokenInfo.exp <= currentTime) {
    throw new ReqError('errorMessages.auth.jwtExpire')
  }

  return tokenInfo
}

export const parseUserFromJwt = async (token: string, verified = true) => {
  const { data: userId, iat } = parseJwt(token)
  const user = await User.findOne({ _id: userId, verified })

  if (!user) throw new ReqError('No user found', 404)
  if (iat < Math.ceil(new Date(user.passwordModifiedAt).valueOf() / 1000)) {
    throw new ReqError('Auth token expired', 401)
  }

  return user
}
