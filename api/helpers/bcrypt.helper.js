import bcrypt from 'bcrypt'
import { DB_CONFIG } from '../utils/constants.util.js'

export const generatePasswordAndHashedOTP = async (value) => {
  return await bcrypt.hash(value, DB_CONFIG.SALT_ROUND)
}

export const verifyPasswordAndHashedOTP = async (value, hashedValue) => {
  return await bcrypt.compare(value, hashedValue)
}
