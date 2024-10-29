import helpers from "../helpers/index.js";
import models from "../models/index.js";
import services from "../services/index.js";
import { STATUS_CODE } from "../utils/constants.util.js";

export const signInWithPassword = async (req, res) => {
    const { email, password } = req.body;
    let manager
    try {
      const user = await services.findUserByEmail(email);
  
      if (!user) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'User does not exist' });
      }
  
      if (user.dataValues.deletedAt) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Account deactivated' });
      }
  
      if (!user) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'User not found' });
      }
  
      const roles = await models.Roles.findOne({ where: { role_id: user.role_id } });
      
      if (roles.role_code === 2) {
        manager = await models.Users.findOne({
          where: { role_id: user.role_id },
          attributes: ['user_id'],
        });
      }
  
      const isCorrectPassword = await helpers.verifyPasswordAndHashedOTP(password, user.password);
      if (!isCorrectPassword) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Incorrect password' });
      }
  
      const permissions = await services.getPermissions(user.role_id);
  
      const userData = {
        userId: user.user_id,
        userRole: user.role_id,
        userEmail: user.email,
        userName: user.user_name,
        roleName: roles.role_name,
      };
  
      const accessToken = helpers.generateAccessToken(userData);
  
      return res.status(200).json({
        message: 'Login success',
        data: {
          accessToken,
          permissions,
          userData,
        },
      });
    } catch (error) {
      return res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message });
    }
  };
  