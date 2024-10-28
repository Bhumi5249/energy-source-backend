import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.HOST,
      dialect: 'mysql',
      logging: false,
    },
)

sequelize
    .authenticate()
    .then(() => {
      console.log('connection established')
    })
    .catch((err) => {
      console.log('connection failed ', err)
    })

const db = { Sequelize, sequelize }

db.sequelize
    // .sync({ alter: true })
    .sync({ sync: false })
    .then(() => {
      const models = sequelize.models
      const modelNames = Object.keys(models)
      modelNames.forEach((modelName) => {
        const model = models[modelName]
        model.describe().then(() => {
          console.log(`Model "${modelName}" has been migrated. Table definition: `)
        })
      })
    })
    .then(async () => {
      const services = await import('../services/index.js')
      // await services.default.createDefaultUserRoles()
      // await services.default.createAdmin()
      // await services.default.createDefaultPermissions()
      // await services.default.createDefaultEntries()
    })
    .catch((error) => {
      console.log(error)
    })

export default db
