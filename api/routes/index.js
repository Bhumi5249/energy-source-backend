import { Router } from 'express'
import authRouter from './auth.route.js'
import roleRouter from './roles.route.js'

const router = Router()

router.use('/auth', authRouter)
router.use(roleRouter)

export default router
