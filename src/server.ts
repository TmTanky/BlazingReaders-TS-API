require('dotenv').config()
import express, { NextFunction, Response, Request } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import {connect} from 'mongoose'
import createError from 'http-errors'

const PORT = process.env.PORT || 8000
const app = express()

import registerRoute from './routes/register/register'
import loginRoute from './routes/login/login'

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

connect(`${process.env.MONGO}`, {useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true})

app.use(registerRoute)
app.use(loginRoute)

app.use((req, res, next) => {
    next(createError(400, 'Route not found.'))
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status = res.status ?? 500
    return res.json({
        status: res.status,
        msg: err.message
    })
})

app.listen(PORT, () => {
    console.log(`Serve is running on port ${PORT}`)
})