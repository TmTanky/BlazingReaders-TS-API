import {RequestHandler} from 'express'
import createError from 'http-errors'
import { ObjectID } from 'mongodb'

// Roles
import {Roles} from '../../interfaces/roles'

// Models
import {User} from '../../models/users/user'
import {Blog} from '../../models/posts/post'
import { Types } from 'mongoose'

export const dashboardInfo: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID

    try {

        const isAdmin = await User.findById(userID)
        const publishersBlogs = await Blog.find().where('createdBy', {_id: userID})
        const top3LikedBlogs = await Blog.aggregate([
            { $match: { createdBy: Types.ObjectId(userID) }},
            { $project: {
                _id: '$_id',
                title: '$title',
                totalLikes: { $size: '$likes' }
            }},
            { $sort: { totalLikes: -1 } },
            { $limit: 3 },
        ])
        const top3MostCommentedBlogs = await Blog.aggregate([
            { $match: { createdBy: Types.ObjectId(userID) } },
            { $project: {
                _id: '$_id',
                title: '$title',
                totalComments: { $size: '$comments' }
            }},
            { $sort: { totalComments: -1 } },
            { $limit: 3 }
        ])

        if (isAdmin?.role !== Roles.ADMIN) {
            return next(createError(400, "You're not a publisher."))
        }

        return res.status(200).json({
            allBlogs: publishersBlogs.length,
            top3LikedBlogs,
            top3MostCommentedBlogs
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const getMyBlogs: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID

    try {

        const myBlogs = await Blog.find().where('createdBy', {_id: userID})

        return res.status(200).json({
            status: 'ok',
            myBlogs
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}