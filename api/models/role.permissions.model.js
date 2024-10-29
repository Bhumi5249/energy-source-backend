import { DataTypes } from 'sequelize'
import db from '../helpers/db.helper.js'
import { v4 as uuidv4 } from 'uuid'
import Roles from './roles.model.js'

const RolePermissions = db.sequelize.define(
    'role_permissions',
    {
      role_permission_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      role_id: {
        type: DataTypes.UUID,
      },
      permission_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
)

RolePermissions.belongsTo(Roles, { foreignKey: 'role_id' })
Roles.hasMany(RolePermissions, { foreignKey: 'role_id' })


export default RolePermissions



