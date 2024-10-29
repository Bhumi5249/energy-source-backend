import { DataTypes } from 'sequelize'
import db from '../helpers/db.helper.js'
import { v4 as uuidv4 } from 'uuid'
import Roles from './roles.model.js'

const Users = db.sequelize.define(
    'users',
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      user_name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      role_id: {
        type: DataTypes.UUID,
      },
      user_status: {
        type: DataTypes.ENUM('active', 'inactive', 'archive'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      paranoid: true,
      timestamps: true,
    },
)

Users.belongsTo(Roles, { foreignKey: 'role_id' })
Roles.hasMany(Users, { foreignKey: 'role_id' })



export default Users
