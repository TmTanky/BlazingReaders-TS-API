import {RequestHandler} from 'express'
import {hash, compare} from 'bcrypt'
import {sign} from 'jsonwebtoken'
import createError from 'http-errors'
// import sharp from 'sharp'

// Enums 
import {Roles} from '../../interfaces/roles'

// Models
import {User} from '../../models/users/user'
// import {Blog} from '../../models/posts/post'
import {Tweet} from '../../models/tweets/tweet'
import { Iuser } from '../../interfaces/users'

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

export const getAllUsers: RequestHandler = async (req, res, next) => {

    try {

        const allUsers = await User.find()

        return res.status(200).json({
            status: res.status,
            data: allUsers
        })
        
    } catch (err) {
        next(createError(400, 'Please try again'))
    }

}

export const editUserRole: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID
    const {newRole} = req.body as {newRole: string}

    try {

        const updatedUser = await User.findOneAndUpdate({_id: userID}, {
            role: newRole
        }, { new: true })

        return res.status(200).json({
            status: 'ok',
            data: updatedUser
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const dashboardInfo: RequestHandler = async (req, res, next) => {

    try {

        const allUsers = await User.find()

        return res.status(200).json({
            status: res.status,
            data: {
                totalUsers: allUsers.length
            }
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const getUserInfo: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID

    try {

        const user = await User.findById(userID).populate('myBlogs').populate('myTweets').populate('followers').populate('following')
        const usersTweets = await Tweet.find().populate('tweetBy').where('tweetBy', {_id: userID}).sort({createdAt: -1})

        return res.status(200).json({
            status: res.status,
            myTweets: usersTweets,
            data: user
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const followAndUnfollow: RequestHandler =  async (req, res, next) => {

    const userID = req.params.userID
    const otherID = req.params.otherID

    try {

        const toFollow = await User.findOne({_id: otherID}).populate('followers')

        const result = toFollow?.followers.find((item) => item._id == userID)

        if (result) {

            await User.findOneAndUpdate({_id: userID}, {
                $pull: {
                    following: otherID
                }
            })
    
            await User.findOneAndUpdate({_id: otherID}, {
                $pull: {
                    followers: userID
                }
            })

            return res.status(200).json({
                msg: 'Unfollowed'
            })

        }

        await User.findOneAndUpdate({_id: userID}, {
            $addToSet: {
                following: otherID
            }
        })

        await User.findOneAndUpdate({_id: otherID}, {
            $addToSet: {
                followers: userID
            }
        })

        return res.status(200).json({
            msg: 'followed'
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const editName: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID
    const {firstName, lastName} = req.body as {firstName: string, lastName: string}

    try {

        await User.findOneAndUpdate({_id: userID}, {
            firstName,
            lastName
        })

        return res.status(200).json({
            status: 'ok',
            msg: 'Change Name Success'
        })
        
    } catch (err) {
        next(createError(400, 'Please try agai.'))
    }

}

export const editEmail: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID
    const {email, password} = req.body as {email: string, password: string}

    try {

        const foundUser = await User.findOne({_id: userID})
        const result = await compare(password, foundUser!.password)

        if (result) {
            await User.findOneAndUpdate({_id: userID}, {
                email
            })
    
            return res.status(200).json({
                status: 'ok',
                msg: 'Email Changed Successfully'
            })
        } else {
            next(createError(400, 'Invalid Password, try again.'))
        }
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const editPassword: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID
    const {currentPass, newPass} = req.body as {currentPass: string, newPass: string}

    try {

        const currentUser = await User.findOne({_id: userID})
        const result = await compare(currentPass, currentUser!.password)

        if (result) {

            const hashedPassword = await hash(newPass, 10)

            if (newPass.length < 8) {
                return next(createError(400, 'Password must be 8 characters long.'))
            }

            await User.findOneAndUpdate({_id: userID}, {
                password: hashedPassword
            })

            return res.status(200).json({
                status: 'ok',
                msg: 'Password Succesfully Changed.'
            })

        } else {
            return next(createError(400, 'Invalid Password.'))
        }
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const editAvatar: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID

    try {

        if (!req.file) {
            return next(createError(400, 'Photo must be provided.'))
        }

        await User.findOneAndUpdate({_id: userID}, {
            avatar: `${req.file.path}`
        })

        return res.status(202).json({
            status: 'ok',
            msg: 'Avatar Changed Successfully'
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}