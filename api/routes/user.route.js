import { Router } from 'express'
import controllers from '../controllers/index.js'


const userRouter = Router()

userRouter.get(
    '/getUser',
    controllers.getUserList
)

userRouter.post(
    '/addUser',
    controllers.addUser
)

userRouter.put(
    '/updateUser/:userId',
    controllers.updateUser
)

userRouter.delete(
    '/deleteUser/:userId',
    controllers.deleteUser
)


export default userRouter