import { authenticateJWTToken, authorization } from './auth.middleware.js'

const middlewares = {
  authenticateJWTToken,
  authorization,
}

export default middlewares
