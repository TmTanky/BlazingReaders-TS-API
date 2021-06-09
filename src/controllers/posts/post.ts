import { RequestHandler } from 'express'
import createError from 'http-errors'

// Models
import {Blog} from '../../models/posts/post'
import {User} from '../../models/users/user'
import {Comment} from '../../models/comments/comment'

// TS 
import {Roles} from '../../interfaces/roles'


export const createBlog: RequestHandler = async (req, res ,next) => {

    const userID = req.params.userID
    const {title, content} = req.body as {title: string, content: string}

    try {

        const user = await User.findOne({_id: userID})

        if (!title || !content) {
            return next(createError(400, 'Inputs cannot be empty.'))
        }

        if (user?.role === Roles.ADMIN) {

            const newBlog = new Blog({
                createdBy: userID,
                title,
                content
            })

            await newBlog.save()

            res.status(201).json({
                status: res.status,
                data: newBlog,
                msg: 'Blog created.'
            })

        } else {
            return next(createError(400, 'Unauthorized, Only admin users.'))
        }
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const editBlog: RequestHandler = async (req, res, next) => {

    const blogID = req.params.blogID
    const {title, content} = req.body as {title: string, content: string}

    try {

        const found = await Blog.findById(blogID)

        if (!found) {
            return next(createError(400, 'Blog not found.'))
        }

        if (!title || !content) {
            return next(createError(400, 'Inputs cannot be empty.'))
        }

        const updatedBlog = await Blog.findOneAndUpdate({_id: blogID}, {
            title,
            content
        }, { new: true })

        return res.status(200).json({
            status: res.status,
            data: updatedBlog,
            msg: 'Blog Updated!'
        })
        
    } catch (err) {
        next(createError('Please try again.'))
    }

}

export const deleteBlog: RequestHandler = async (req, res, next) => {

    const blogID = req.params.blogID

    try {

        const found = await Blog.findById(blogID)

        if (!found) {
            return next(createError(400, 'Blog not found.'))
        }

        await Blog.findByIdAndRemove(blogID) 

        res.status(200).json({
            status: res.status,
            msg: 'Blog deleted.'
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const likeBlog: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID
    const blogID = req.params.blogID

    try {

        const alreadyLiked = await Blog.findOne({_id: blogID}).populate('likes')
        const result = alreadyLiked!.likes.find(item => item._id == userID)

        if (result) {

            await Blog.findOneAndUpdate({_id: blogID}, {
                $pull: {
                    likes: userID
                }
            })

            return res.status(200).json({
                status: res.status,
                msg: 'You unliked the blog.'
            })

        }

        await Blog.findOneAndUpdate({_id: blogID}, {
            $addToSet: {
                likes: userID
            }
        })

        return res.status(200).json({
            status: res.status,
            msg: 'You liked the blog.'
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const commentOnBlog: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID
    const blogID = req.params.blogID
    const {content} = req.body as {content: string}

    try {

        if (!content) {
            return next(createError(400, 'Comment cannot be empty.'))
        }

        const newComment = new Comment({
            content,
            commentedOn: blogID,
            commentBy: userID
        })

        await Blog.findOneAndUpdate({_id: blogID}, {
            $addToSet: {
                comments: userID
            }
        })

        await newComment.save()

        res.status(200).json({
            status: res.status,
            data: newComment,
            msg: 'You commented on the post.'
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}