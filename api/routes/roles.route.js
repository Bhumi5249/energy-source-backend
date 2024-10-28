import { Router } from 'express'
import controller from '../controllers/index.js'
import middlewares from '../middleware/index.js'
const roleRouter = Router()

roleRouter.get('/roles', middlewares.authenticateJWTToken, controller.getRoles)

roleRouter.get('/permissions', middlewares.authenticateJWTToken, controller.getRolePermission)

export default roleRouter
