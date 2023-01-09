import jsonwebtoken from 'jsonwebtoken'
const jwtTokenPrefix = 'Bearer '
const error = new ReqError('Invalid token')

export const generateUserJwt = (userId) => generateJwt({ userId })
export const generateCookieJwt = (cookie) => generateJwt({ cookie })
export const generateEmailJwt = (email) => generateJwt({ email }, '1d')

export const generateJwt = (data, expiresIn = '90d') => {
  return jsonwebtoken.sign({ ...data }, process.env.JWT_SECRET, { expiresIn })
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
