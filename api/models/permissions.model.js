import { DataTypes } from 'sequelize'
import db from '../helpers/db.helper.js'
import RolePermissions from './role.permissions.model.js'

const Permissions = db.sequelize.define(
    'permissions',
    {
      permission_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      parent_permission_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
      },
      permission_code: {
        type: DataTypes.STRING,
      },
      permission_name: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
)

RolePermissions.belongsTo(Permissions, { foreignKey: 'permission_id' })

export default Permissions
