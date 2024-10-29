import { signInWithPassword } from "./auth.controller.js"
import { getProductionList, addProduction, deleteProduction, updateProduction } from "./production.controller.js"
import { getSourceList, addSource, deleteSource, updateSource } from "./source.controller.js"
import { addUser, deleteUser, getUserList, updateUser } from "./user.controller.js"

const controllers = {
  signInWithPassword,
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  getProductionList,
  addProduction,
  deleteProduction,
  updateProduction,
  getSourceList,
  addSource,
  updateSource,
  deleteSource
}

export default controllers
