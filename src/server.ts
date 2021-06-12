require('dotenv').config()
import express, { NextFunction, Response, Request } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import {connect} from 'mongoose'
import createError from 'http-errors'

const PORT = process.env.PORT || 8000
const app = express()

import userRoute from './routes/users/user'
import registerRoute from './routes/users/register'
import loginRoute from './routes/users/login'
import blogRoute from './routes/posts/post'
import practiceUpload from './routes/imgs/tryimgupload'

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/public',express.static('public'))

connect(`${process.env.MONGO}`, {useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true})

app.use(registerRoute)
app.use(loginRoute)
app.use(blogRoute)
app.use(practiceUpload)
app.use(userRoute)

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
    console.log(`Server is running on port ${PORT}`)
})