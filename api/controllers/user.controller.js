import { Sequelize } from "sequelize"
import models from "../models/index.js"
import { STATUS_CODE } from "../utils/constants.util.js"

export const getUserList = async(req, res) => {
    try {
        const user = await models.Users.findAll({
            attributes: [['user_id', 'userId'],['user_name', 'userName'], 'email', 'password', ['role_id', 'roleId'],  [Sequelize.col('Role.role_name'), 'roleName']],
            include: [
                {
                    model: models.Roles,
                    attributes: []
                }
            ],
            raw: true
        })

        res.status(STATUS_CODE.HTTP_SUCCESS).send(user)
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const getRoles = async(req, res) => {
    try {
        const roles = await models.Roles.findAll({
            attributes: [['role_id', 'roleId'], ['role_name', 'roleName']],
        })

        res.status(STATUS_CODE.HTTP_SUCCESS).send(roles)
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const addUser = async(req, res) => {
    try {
        const { userName, email, password, roleId } = req.body
        await models.Users.create({
            user_name: userName,
            email,
            password,
            role_id: roleId
        })
        res.status(STATUS_CODE.HTTP_SUCCESS).json({ message: 'user created' })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const updateUser = async(req, res) => {
    try {
        const { userId } = req.params
        const { userName, email, password, roleId } = req.body
        const findUser = await models.Users.findOne({ where: { user_id: userId } })
        if(!findUser){
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'user not found' })
        }
        await models.Users.update({
            user_name: userName,
            email,
            password,
            role_id: roleId
        },
        {
            where: { user_id: userId }
        }
    )
    res.status(STATUS_CODE.HTTP_SUCCESS).json({ message: 'user updated' })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const deleteUser = async(req, res) => {
    try {
        const { userId } = req.params
        const findUser = await models.Users.findOne({ where: { user_id: userId } })
        if(!findUser){
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'user not found' })
        }
        await models.Users.update(
            {
               user_status: 'inactive'
            },
        {
            where: { user_id: userId }
        })
        await models.Users.destroy({
            where: { user_id: userId }
        })
        res.status(STATUS_CODE.HTTP_SUCCESS).json({ message: 'user deleted' })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}


