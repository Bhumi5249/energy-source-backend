import { Router } from 'express'
import controllers from '../controllers/index.js'
import middlewares from '../middleware/index.js'


const productionRouter = Router()

productionRouter.get(
    '/getProduction',
    middlewares.authenticateJWTToken,
    middlewares.authorization(['LIST_PRODUCTION']),
    controllers.getProductionList
)

productionRouter.get(
    '/productions/range',
    controllers.getProductionDataByDateRange
)

productionRouter.get(
    '/productions/download',
    controllers.getProductionDataCSV
)

productionRouter.post(
    '/addProduction',
    middlewares.authenticateJWTToken,
    middlewares.authorization(['ADD_PRODUCTION']),
    controllers.addProduction
)

productionRouter.put(
    '/updateProduction/:productionId',
    middlewares.authenticateJWTToken,
    middlewares.authorization(['EDIT_PRODUCTION']),
    controllers.updateProduction
)

productionRouter.delete(
    '/deleteProduction/:productionId',
    middlewares.authenticateJWTToken,
    middlewares.authorization(['DELETE_PRODUCTION']),
    controllers.deleteProduction
)


export default productionRouter