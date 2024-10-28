import { generatePasswordAndHashedOTP, verifyPasswordAndHashedOTP, generateOTP } from './bcrypt.helper.js'
import { generateAccessToken, generateRefreshToken, verifyToken, decodeToken, isJwtTokenExpired, generateForgotPasswordToken, verifyForgotPasswordToken } from './jwt.helper.js'

const helpers = {
  generatePasswordAndHashedOTP,
  verifyPasswordAndHashedOTP,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateForgotPasswordToken,
  verifyForgotPasswordToken,
  decodeToken,
  isJwtTokenExpired,
}

export default helpers
