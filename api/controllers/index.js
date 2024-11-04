import { signInWithPassword } from "./auth.controller.js"
import { getProductionList, addProduction, deleteProduction, updateProduction, getProductionDataByDateRange } from "./production.controller.js"
import { getSourceList, addSource, deleteSource, updateSource } from "./source.controller.js"
import { addUser, deleteUser, getRoles, getUserList, updateUser } from "./user.controller.js"

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
  deleteSource,
  getProductionDataByDateRange,
  getRoles
}

export default controllers
