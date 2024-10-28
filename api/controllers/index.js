import { signInWithPassword } from "./auth.controller.js"
import { getRolePermission } from "./role.permission.controller.js"
import { getRoles } from "./roles.controller.js"

const controllers = {
  signInWithPassword,
  getRolePermission,
  getRoles
}

export default controllers
