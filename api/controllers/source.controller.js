import models from "../models/index.js"
import { STATUS_CODE } from "../utils/constants.util.js"

export const getSourceList = async(req, res) => {
    try {
        const source = await models.EnergySource.findAll({
            attributes: [['sources_id', 'sourcesId'], 'name', 'type', 'capacity']
        })

        res.status(STATUS_CODE.HTTP_SUCCESS).send(source);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const addSource = async(req, res) => {
    try {
        const { name, type, capacity } = req.body
        await models.EnergySource.create({
           name,
           type,
           capacity
        })
        res.status(STATUS_CODE.HTTP_SUCCESS).json({ message: 'source created' })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const updateSource = async(req, res) => {
    try {
        const { sourceId } = req.params
        const { name, type, capacity } = req.body
        const findSource = await models.EnergySource.findOne({ where: { sources_id: sourceId } })
        if(!findSource){
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'source not found' })
        }
        await models.EnergySource.update({
           name,
           type,
           capacity
        },
        {
            where: { sources_id: sourceId }
        }
    )
    res.status(STATUS_CODE.HTTP_SUCCESS).json({ message: 'source updated' })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const deleteSource = async(req, res) => {
    try {
        const { sourceId } = req.params
        const findSource = await models.EnergySource.findOne({ where: { sources_id: sourceId } })
        if(!findSource){
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'source not found' })
        }
        await models.EnergySource.destroy({
            where: { sources_id: sourceId }
        })
        res.status(STATUS_CODE.HTTP_SUCCESS).json({ message: 'user deleted' })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}


