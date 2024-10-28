import models from '../models/index.js'
import scripts from '../script/index.js'
import helpers from '../helpers/index.js'
import { DB_CONFIG } from '../utils/constants.util.js'
import db from '../helpers/db.helper.js'
import middlewares from '../middleware/index.js'

export const findUserByEmail = async (email) => {
  const user = await models.Users.findOne({
    where: {
      email,
      user_status: 'active',
    },
    include: {
      model: models.Roles,
      attributes: ['role_name', 'mobile_access'],
      raw: true,
    },
    paranoid: false,
  })
  return user
}

export const findUserByPhone = async (phone) => {
  const user = await models.Users.findOne({
    where: {
      phone,
      user_status: 'active',
    },
    include: {
      model: models.Roles,
      attributes: ['role_name', 'mobile_access'],
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

export const createDefaultUserRoles = middlewares.controllerWrapper(async () => {
  const t = await db.sequelize.transaction()
  const res = await models.Roles.findAll()

  if (!res.length) {
    await models.Roles.bulkCreate(
        [
          { role_name: DB_CONFIG.USER_ROLES.super_admin, mobile_access: true, role_code: 5 },
          { role_name: DB_CONFIG.USER_ROLES._1, mobile_access: true, role_code: 1 },
          { role_name: DB_CONFIG.USER_ROLES._2, mobile_access: false, role_code: 2 },
          { role_name: DB_CONFIG.USER_ROLES._3, mobile_access: true, role_code: 3 },
          { role_name: DB_CONFIG.USER_ROLES._4, mobile_access: true, role_code: 4 },
        ],
        { transaction: t },
    )
    await t.commit()
    console.log('Roles created')
  }
})


export const createAdmin = middlewares.controllerWrapper(async () => {
  const t = await db.sequelize.transaction()
  const existingAdmin = await models.Users.findOne({ where: { email: DB_CONFIG.ADMIN_CREDENTIALS.ADMIN_USER_NAME } })
  const existingRoleAdmin = await models.Roles.findOne({ where: { role_code: 5 } })

  if (!existingAdmin) {
    const hashedPassword = await helpers.generatePasswordAndHashedOTP(DB_CONFIG.ADMIN_CREDENTIALS.ADMIN_PASSWORD)
    await models.Users.create(
        { email: DB_CONFIG.ADMIN_CREDENTIALS.ADMIN_USER_NAME, password: hashedPassword, role_id: existingRoleAdmin.role_id },
        { transaction: t },
    )
    await t.commit()
    console.log('Admin created')
  }
})


export const createDefaultPermissions = middlewares.controllerWrapper(async () => {
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
})

const assignRolePermissions = async (permission, roles, transaction) => {
  for (const role of roles) {
    const permissionsToAssign = []

    switch (role.role_code) {
      case 1: // admin
      case 2: // branch
        // Admin and branch roles should get all permissions except specific ones
        if (!['VIEW_FACULTY_PROFILE', 'VIEW_STUDENT_PROFILE', 'VIEW_COURSE_DETAIL', 'VIEW_STUDENT_FEES', 'VIEW_STUDENT_EXAM', 'VIEW_FACULTY_EXAM_ASSESSMENT', 'BILLING_HISTORY', 'FACULTY_DASHBOARD', 'STUDENT_DASHBOARD'].includes(permission.permission_code)) {
          permissionsToAssign.push(permission.permission_id)
        }

        break
      case 3: // faculty
        // Faculty role should get specific permissions
        if (['VIEW_FACULTY_PROFILE', 'VIEW_FACULTY_EXAM_ASSESSMENT', 'BILLING_HISTORY', 'FACULTY_DASHBOARD', 'LIST_TIMETABLE', 'FILTER_TIMETABLE', 'LIST_ATTENDANCE', 'TAKE_ATTENDANCE'].includes(permission.permission_code)) {
          permissionsToAssign.push(permission.permission_id)
        }

        break
      case 4: // student
        // Student role should get specific permissions
        if (['VIEW_STUDENT_PROFILE', 'VIEW_COURSE_DETAIL', 'VIEW_STUDENT_FEES', 'VIEW_STUDENT_EXAM', 'STUDENT_DASHBOARD'].includes(permission.permission_code)) {
          permissionsToAssign.push(permission.permission_id)
        }

        break

      case 5: // super admin
        if (['ADMIN_DASHBOARD', 'LIST_ORG', 'ADD_ORG', 'EDIT_ORG', 'ARCHIVE_ORG', 'RESTORE_ORG', 'LIST_COMMUNICATION', 'ADD_COMMUNICATION', 'EDIT_COMMUNICATION', 'VIEW_CONFIGURATION'].includes(permission.permission_code)) {
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


