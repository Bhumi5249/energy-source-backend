import { Router } from 'express'
import controllers from '../controllers/index.js'


const productionRouter = Router()

productionRouter.get(
    '/getProduction',
    controllers.getProductionList
)

productionRouter.post(
    '/addProduction',
    controllers.addProduction
)

productionRouter.put(
    '/updateProduction/:productionId',
    controllers.updateProduction
)

productionRouter.delete(
    '/deleteProduction/:productionId',
    controllers.deleteProduction
)


export default productionRouter