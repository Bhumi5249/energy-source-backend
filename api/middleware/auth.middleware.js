import helpers from '../helpers/index.js'
import models from '../models/index.js'
import services from '../services/index.js'
import { STATUS_CODE } from '../utils/constants.util.js'

export const authenticateJWTToken = async (req, res, next) => {
    try {
      const authHeader = req.headers['x-access-token'] || req.headers.authorization;
      const headerToken = authHeader && authHeader.replace('Bearer ', '');
      if (!headerToken) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Auth token required' });
      }
  
      const user = helpers.verifyToken(headerToken, res);
      if (!user) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Invalid token' });
      }
  
      const isUserActive = await models.Users.findOne({
        where: {
          user_id: user.userId,
          user_status: 'active',
        },
        paranoid: false,
      });
      if (!isUserActive) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Account deactivated' });
      }
  
      req.user = user;
      next();
    } catch (error) {
      return res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message });
    }
};
  

export const authorization = (permissions) => {
    return async (req, res, next) => {
      let authorized = false;
  
      try {
        const user = await models.Users.findOne({
          where: {
            user_id: req.user.userId,
            email: req.user.userEmail,
          },
          attributes: ['user_id', 'role_id'],
        });
  
        if (!user) {
          return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'User not authorized' });
        }
  
        if (['admin'].includes(req.user.roleName)) {
          authorized = true;
        } else {
          const userPermissions = await services.getPermissions(req.user.userRole);
          permissions.forEach((rule) => {
            if (userPermissions?.includes(rule)) {
              authorized = true;
            }
          });
          req.userPermissions = userPermissions;
        }
  
        if (authorized) {
          req.user = user;
          console.log("authorized===========???", authorized);
          next();
        } else {
          console.log("authorized===========???", authorized);
          return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHORIZED });
        }
      } catch (error) {
        return res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message });
      }
    };
};
  

