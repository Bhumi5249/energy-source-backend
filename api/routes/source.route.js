import { Router } from 'express'
import controllers from '../controllers/index.js'
import middlewares from '../middleware/index.js'


const sourceRouter = Router()

sourceRouter.get(
    '/getSource',
    middlewares.authenticateJWTToken,
    middlewares.authorization(['LIST_SOURCE']),
    controllers.getSourceList
)

sourceRouter.post(
    '/addSource',
    middlewares.authenticateJWTToken,
    middlewares.authorization(['ADD_SOURCE']),
    controllers.addSource
)

sourceRouter.put(
    '/updateSource/:sourceId',
    middlewares.authenticateJWTToken,
    middlewares.authorization(['EDIT_SOURCE']),
    controllers.updateSource
)

sourceRouter.delete(
    '/deleteSource/:sourceId',
    middlewares.authenticateJWTToken,
    middlewares.authorization(['DELETE_SOURCE']),
    controllers.deleteSource
)


export default sourceRouter