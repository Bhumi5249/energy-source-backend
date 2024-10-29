import { Router } from 'express'
import controllers from '../controllers/index.js'


const authRouter = Router()

authRouter.post(
    '/signIn',
    controllers.signInWithPassword,
)


export default authRouter
