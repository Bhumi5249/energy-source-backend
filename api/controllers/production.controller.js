import { Op, Sequelize } from "sequelize";
import models from "../models/index.js"
import { STATUS_CODE } from "../utils/constants.util.js"
import { Parser } from "json2csv";

export const getProductionList = async(req, res) => {
    try {
        const production = await models.Production.findAll({
            attributes: [
                ['production_id', 'productionId'],
                ['sources_id', 'sourcesId'],
                'date',
                'production',
                [Sequelize.col('EnergySource.name'), 'sourceName']
            ],
            include: [
                {
                    model: models.EnergySource,
                    attributes: [],
                }
            ],
            raw: true
        });

        res.status(STATUS_CODE.HTTP_SUCCESS).send(production)
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message })
    }
}

export const getProductionDataByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const productions = await models.Production.findAll({
            where: {
                date: {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                },
            },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('date')), 'date'],
                [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('production'), 'FLOAT')), 'totalProduction'], // Cast production to FLOAT for summation
                'sources_id', // Include sources_id in the attributes
            ],
            group: ['date', 'sources_id'], // Group by date and sources_id
            include: [
                {
                    model: models.EnergySource,
                    attributes: ['name'],
                },
            ],
        });

        const formattedData = productions.map(prod => ({
            date: prod.date,
            totalProduction: parseFloat(prod.dataValues.totalProduction), // Access totalProduction correctly
            sourceId: prod.sources_id,
            sourceName: prod.energySource.name, // Adjusted to access the nested name correctly
        }));

        res.status(STATUS_CODE.HTTP_SUCCESS).json(formattedData);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message });
    }
};

export const getProductionDataCSV = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const productions = await models.Production.findAll({
            where: {
                date: {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                },
            },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('date')), 'date'],
                [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('production'), 'FLOAT')), 'totalProduction'],
                'sources_id',
            ],
            group: ['date', 'sources_id'],
            include: [
                {
                    model: models.EnergySource,
                    attributes: ['name'],
                },
            ],
        });

        const formattedData = productions.map(prod => ({
            date: prod.date,
            totalProduction: parseFloat(prod.dataValues.totalProduction),
            sourceId: prod.sources_id,
            sourceName: prod.energySource.name,
        }));

        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(formattedData);

        res.header('Content-Type', 'text/csv');
        res.attachment('production_data.csv');
        res.send(csvData);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).json({ message: error.message });
    }
};

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


