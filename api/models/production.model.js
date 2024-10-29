import { DataTypes } from 'sequelize'
import db from '../helpers/db.helper.js'
import { v4 as uuidv4 } from 'uuid'
import EnergySource from './energySource.model.js'

const Production = db.sequelize.define(
    'production',
    {
      production_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      sources_id: {
        type: DataTypes.UUID,
      },
      date: {
        type: DataTypes.STRING,
      },
      production: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    },
)

Production.belongsTo(EnergySource, { foreignKey: 'sources_id' })
EnergySource.hasMany(Production, { foreignKey: 'sources_id' })


export default Production
