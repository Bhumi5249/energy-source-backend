import {
  findUserByEmail,
  findUserByPhone,
  findUserById,
} from './user.service.js'
import { getPermissions } from '../services/authorization.service.js'

const services = {
  getPermissions,
  findUserByEmail,
  findUserByPhone,
  findUserById,
}

export default services
