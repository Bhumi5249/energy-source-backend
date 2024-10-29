import { Router } from 'express'
import controllers from '../controllers/index.js'


const sourceRouter = Router()

sourceRouter.get(
    '/getSource',
    controllers.getSourceList
)

sourceRouter.post(
    '/addSource',
    controllers.addSource
)

sourceRouter.put(
    '/updateSource/:sourceId',
    controllers.updateSource
)

sourceRouter.delete(
    '/deleteSource/:sourceId',
    controllers.deleteSource
)


export default sourceRouter