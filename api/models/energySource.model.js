import { DataTypes } from 'sequelize'
import db from '../helpers/db.helper.js'
import { v4 as uuidv4 } from 'uuid'

const EnergySource = db.sequelize.define(
    'energySource',
    {
      sources_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      name: {
        type: DataTypes.UUID,
      },
      type: {
        type: DataTypes.STRING,
      },
      capacity: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    },
)


export default EnergySource
