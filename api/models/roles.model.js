import { DataTypes } from 'sequelize'
import db from '../helpers/db.helper.js'
import { v4 as uuidv4 } from 'uuid'

const Roles = db.sequelize.define(
    'roles',
    {
      role_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      role_code: {
        type: DataTypes.INTEGER,
      },
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      indexes: [{ unique: true, fields: ['role_id', 'role_code'] }],
    },
)


export default Roles
