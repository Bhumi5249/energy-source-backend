import models from '../models/index.js'

export const getPermissions = async (role) => {
  // Retrieve all permission IDs associated with the role from the Permissions table
  const allPermissionIds = await models.RolePermissions.findAll({
    where: {
      role_id: role,
    },
    attributes: [],
    include: [{
      model: models.Permissions,
      attributes: ['permission_code'],
    }]
  })
  // Use Promise.all to fetch permission names concurrently
  // const permissionPromises = allPermissionIds.map(async (obj) => {
  //   const permission = await models.Permissions.findOne({
  //     where: {
  //       permission_id: obj.permission_id,
  //     },
  //     attributes: ['permission_code'],
  //   })
  //   return permission ? permission.permission_code : null
  // })

  // Await all promises concurrently and filter out null values
  // const permissions = (await Promise.all(permissionPromises)).filter(Boolean)
  const finalResult = allPermissionIds && allPermissionIds?.map((val) => {
    return  val.dataValues.permission.dataValues.permission_code
  })
  return finalResult
}



