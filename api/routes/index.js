import { Router } from 'express'
import authRouter from './auth.route.js'
import userRouter from './user.route.js'
import productionRouter from './production.route.js'
import sourceRouter from './source.route.js'

const router = Router()

router.use('/auth', authRouter)
router.use(userRouter)
router.use(productionRouter)
router.use(sourceRouter)


export default router
