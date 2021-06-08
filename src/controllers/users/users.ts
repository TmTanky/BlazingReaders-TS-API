import {RequestHandler} from 'express'
import {hash, compare} from 'bcrypt'
import {sign} from 'jsonwebtoken'
import createError from 'http-errors'

// Enums 
import {Roles} from '../../interfaces/roles'

// Models
import {User} from '../../models/users/user'

export const registerUser: RequestHandler = async (req, res, next) => {

    const {firstName, lastName, email, password} = req.body as {
        firstName: string,
        lastName: string,
        email: string,
        password: string
    }

    try {

        if (firstName === "" || lastName === "" || email === "" || password === "") {
            return next(createError(400, 'Please provide all inputs.'))
        }

        if (password.length < 8) {
            return next(createError(400, 'Password must be 8 characters long.'))
        }

        const hashedPassword = await hash(password, 10)

        const registeringUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: Roles.NORMAL
        })

        const token = sign({id: registeringUser._id}, process.env.JWT_KEY as string)

        await registeringUser.save()

        return res.status(201).json({
            status: res.status,
            data: registeringUser,
            token
        })
        
    } catch (err) {

        if (err.code === 11000) {
            return next(createError(400, 'Email already Exists.'))
        }

        next(createError(err, 500))
    }

}

export const loginUser: RequestHandler = async (req, res, next) => {

    const {email, password} = req.body as {email: string, password: string}

    try {

        const loggingUser = await User.findOne({email})

        if (email === "" || password === "") {
            return next(createError(400, 'Please input all fields.'))
        }
        
        if (!loggingUser) {
            return next(createError(400, 'Invalid Email/Password'))
        }

        const result = await compare(password, loggingUser.password)

        if (result) {

            const token = sign({id: loggingUser._id}, process.env.JWT_KEY as string)

            return res.status(200).json({
                status: res.status,
                data: loggingUser,
                token
            })

        } else {
            return next(createError(400, 'Invalid Email/Password'))
        }
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}