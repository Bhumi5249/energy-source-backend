import { DataTypes } from 'sequelize'
import db from '../helpers/db.helper.js'
import { v4 as uuidv4 } from 'uuid'

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
    },
    {
      // indexes: [{ unique: true, fields: [] }],
      paranoid: true,
      timestamps: true,
    },
)


export default Users
