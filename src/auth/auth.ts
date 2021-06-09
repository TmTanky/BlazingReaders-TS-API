import { RequestHandler } from "express"
import createError from 'http-errors'
import {verify} from 'jsonwebtoken'

export const authJWT: RequestHandler = async (req, res, next) => {

    let token

    try {

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1]
            
            const result = verify(token, process.env.JWT_KEY as string)

            if (result) {
                return next()
            }

            else {
                return next(createError('Invalid Token.'))
            }

        }

        if (!token) {
            return next(createError(400, 'Unauthorized.'))
        }
        
    } catch (err) {
        next(createError(400, 'Invalid Token.'))
    }

}