import models from '../models/index.js'
import scripts from '../script/index.js'
import helpers from '../helpers/index.js'
import { DB_CONFIG } from '../utils/constants.util.js'
import db from '../helpers/db.helper.js'

export const findUserByEmail = async (email) => {
  const user = await models.Users.findOne({
    where: {
      email,
      user_status: 'active',
    },
    include: {
      model: models.Roles,
      attributes: ['role_name'],
      raw: true,
    },
    paranoid: false,
  })
  return user
}

export const findUserById = async (userId) => {
  const user = await models.Users.findOne({
    where: {
      user_id: userId,
    },
    paranoid: false,
  })
  return user
}

export const createDefaultUserRoles = async () => {
  const t = await db.sequelize.transaction()
  const res = await models.Roles.findAll()

  if (!res.length) {
    await models.Roles.bulkCreate(
        [
          { role_name: DB_CONFIG.USER_ROLES._1, mobile_access: true, role_code: 1 },
          { role_name: DB_CONFIG.USER_ROLES._2, mobile_access: false, role_code: 2 },
        ],
        { transaction: t },
    )
    await t.commit()
    console.log('Roles created')
  }
}


export const createAdmin = async () => {
  const t = await db.sequelize.transaction()
  const existingAdmin = await models.Users.findOne({ where: { email: DB_CONFIG.ADMIN_CREDENTIALS.ADMIN_USER_NAME } })
  const existingRoleAdmin = await models.Roles.findOne({ where: { role_code: 1 } })

  if (!existingAdmin) {
    const hashedPassword = await helpers.generatePasswordAndHashedOTP(DB_CONFIG.ADMIN_CREDENTIALS.ADMIN_PASSWORD)
    await models.Users.create(
        { email: DB_CONFIG.ADMIN_CREDENTIALS.ADMIN_USER_NAME, password: hashedPassword, role_id: existingRoleAdmin.role_id, user_name: 'admin' },
        { transaction: t },
    )
    await t.commit()
    console.log('Admin created')
  }
}


export const createDefaultPermissions = async () => {
  const transaction = await db.sequelize.transaction()

  const existingPermissions = await models.Permissions.findAll({ transaction })
  const roles = await models.Roles.findAll({ transaction })

  if (!existingPermissions.length) {
    for (const parentData of scripts.permissionData) {
      let parentPermission

      const existingParent = existingPermissions.find((p) => p.permission_code === parentData.parent_permission_code)

      if (!existingParent) {
        parentPermission = await models.Permissions.create(
            { permission_code: parentData.parent_permission_code, permission_name: parentData.parent_permission_name, parent_permission_id: 0 },
            { transaction },
        )
      } else {
        parentPermission = existingParent
      }

      for (let i = 0; i < parentData.permission_code.length; i++) {
        const subPermission = parentData.permission_code[i]
        const subPermissionName = parentData.permission_name[i]

        const existingChild = existingPermissions.find((p) => p.permission_code === subPermission)

        if (!existingChild) {
          const createdPermission = await models.Permissions.create(
              {
                permission_code: subPermission,
                permission_name: subPermissionName,
                parent_permission_id: parentPermission.permission_id,
              },
              { transaction },
          )

          await assignRolePermissions(createdPermission, roles, transaction)
        } else {
          await assignRolePermissions(existingChild, roles, transaction)
        }
      }
    }
  }

  await transaction.commit()
  console.log('Default permissions created successfully')
}

const assignRolePermissions = async (permission, roles, transaction) => {
  for (const role of roles) {
    const permissionsToAssign = []

    switch (role.role_code) {
      case 1: // admin
        if (['LIST_SOURCE', 'ADD_SOURCE', 'EDIT_SOURCE', 'DELETE_SOURCE', 'LIST_PRODUCTION', 'ADD_PRODUCTION', 'EDIT_PRODUCTION', 'DELETE_PRODUCTION', 'LIST_ANALYTICS', 'EXPORT_ANALYTICS', 'LIST_USER', 'ADD_USER', 'EDIT_USER', 'DELETE_USER'].includes(permission.permission_code)) {
          permissionsToAssign.push(permission.permission_id)
        }

        break
      case 3: // manager
        if (['LIST_SOURCE', 'ADD_SOURCE', 'EDIT_SOURCE','LIST_PRODUCTION', 'ADD_PRODUCTION', 'EDIT_PRODUCTION'].includes(permission.permission_code)) {
          permissionsToAssign.push(permission.permission_id)
        }

        break
    }

    for (const permissionId of permissionsToAssign) {
      await models.RolePermissions.create(
          {
            role_id: role.role_id,
            permission_id: permissionId,
          },
          { transaction },
      )
    }
  }
}


