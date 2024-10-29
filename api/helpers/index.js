import { generatePasswordAndHashedOTP, verifyPasswordAndHashedOTP } from './bcrypt.helper.js'
import { generateAccessToken, verifyToken, decodeToken, isJwtTokenExpired, generateForgotPasswordToken, verifyForgotPasswordToken } from './jwt.helper.js'

const helpers = {
  generatePasswordAndHashedOTP,
  verifyPasswordAndHashedOTP,
  generateAccessToken,
  verifyToken,
  generateForgotPasswordToken,
  verifyForgotPasswordToken,
  decodeToken,
  isJwtTokenExpired,
}

export default helpers
