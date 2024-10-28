import { Router } from 'express'
import controllers from '../controllers/index.js'


const authRouter = Router()

authRouter.post(
    '/signin',
    controllers.signInWithPassword,
)


export default authRouter
