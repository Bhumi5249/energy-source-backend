import 'dotenv/config'
import express, { json } from 'express'
import cors from 'cors'
import router from './api/routes/index.js'
const app = express()
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '5p0mb'}));


app.use(
    cors({
      origin: '*',
      methods: 'GET,POST,PUT,DELETE',
      credentials: true,
    }),
)


app.use('/api', router)


app.listen(process.env.PORT, () => console.log('App is running on', process.env.PORT))

