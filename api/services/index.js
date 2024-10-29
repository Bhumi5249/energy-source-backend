import {
  findUserByEmail,
  findUserById,
  createAdmin, createDefaultPermissions, createDefaultUserRoles
} from './user.service.js'
import { getPermissions } from '../services/authorization.service.js'

const services = {
  getPermissions,
  findUserByEmail,
  createAdmin,
  createDefaultPermissions,
  createDefaultUserRoles,
  findUserById,
}

export default services
