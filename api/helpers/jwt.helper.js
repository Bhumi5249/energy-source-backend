import jwt from 'jsonwebtoken'
import { JWT_CONFIG, STATUS_CODE } from '../utils/constants.util.js'


export const generateTokenFunction = (secretKey, expiresIn) => (user) => {
  return jwt.sign(user, secretKey, { expiresIn })
}

// Usage
export const generateForgotPasswordToken = generateTokenFunction(process.env.FORGOT_PASSWORD_SECRET_KEY, JWT_CONFIG.FORGOT_PASSWORD_TOKEN_EXPITY_TIME)
export const generateAccessToken = generateTokenFunction(process.env.SECRET_KEY, JWT_CONFIG.ACCESS_TOKEN_EXPIRY_TIME)


export const verifyTokenFunction = (secretKey) => (token, res) => {
  return jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Invalid token' })
    return user
  })
}

// Usage
export const verifyToken = verifyTokenFunction(process.env.SECRET_KEY)
export const verifyForgotPasswordToken = verifyTokenFunction(process.env.FORGOT_PASSWORD_SECRET_KEY)

export const getTokenFromHeader = (req) => {
  const authHeader = req.headers['x-access-token'] || req.headers.authorization
  const headerToken = authHeader && authHeader.replace('Bearer ', '')
  return headerToken
}

export const decodeToken = (token) => {
  return jwt.decode(token)
}

export const isJwtTokenExpired = (decodedToken) => {
  const expirationTime = decodedToken?.exp * 1000 // Convert seconds to milliseconds

  // Get the current time in milliseconds
  const currentTime = Date.now()

  // Check if the token is expired by comparing the expiration time with the current time
  const isExpired = expirationTime < currentTime
  return isExpired
}
