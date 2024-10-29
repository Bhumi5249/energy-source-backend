import models from "../models/index.js"
import { STATUS_CODE } from "../utils/constants.util.js"

export const getProductionList = async(req, res) => {
    try {
        const production = await models.Production.findAll({
            attributes: [['production_id', 'productionId'],['sources_id', 'sourcesId'], 'date', 'production']
        })

        res.status(STATUS_CODE.HTTP_SUCCESS).json({ data: production })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const addProduction = async(req, res) => {
    try {
        const { sourcesId, date, production } = req.body
        await models.Production.create({
            sources_id: sourcesId,
            date,
            production
        })
        res.status(STATUS_CODE.HTTP_SUCCESS).json({ message: 'production created' })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const updateProduction = async(req, res) => {
    try {
        const { productionId } = req.params
        const { sourcesId, date, production } = req.body
        const findProduction = await models.Production.findOne({ where: { production_id: productionId } })
        if(!findProduction){
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'production not found' })
        }
        await models.Production.update({
            sources_id: sourcesId,
            date,
            production
        },
        {
            where: { production_id: productionId }
        }
    )
    res.status(STATUS_CODE.HTTP_SUCCESS).json({ message: 'production updated' })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const deleteProduction = async(req, res) => {
    try {
        const { productionId } = req.params
        const findProduction = await models.Production.findOne({ where: { production_id: productionId } })
        if(!findProduction){
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'production not found' })
        }
        await models.Production.destroy({
            where: { production_id: productionId }
        })
        res.status(STATUS_CODE.HTTP_SUCCESS).json({ message: 'user deleted' })
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}


