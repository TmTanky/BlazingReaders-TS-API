import { RequestHandler } from "express"
import createError from 'http-errors'

// Models
import {Tweet} from '../../models/tweets/tweet'
import {User} from '../../models/users/user'

export const createTweet: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID
    const {content} = req.body as {content: string}

    try {

        if (!content) {
            return next(createError(400, 'Input cannot be empty.'))
        }

        const newTweet = new Tweet({
            content,
            tweetBy: userID
        })

        await newTweet.save()

        await User.findOneAndUpdate({_id: userID}, {
            $addToSet: {
                myTweets: newTweet._id
            }
        })

        return res.status(200).json({
            status: res.status,
            data: newTweet
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}

export const deleteTweet: RequestHandler = async (req, res, next) => {

    const userID = req.params.userID
    const tweetID = req.params.tweetID

    try {

        const notFound = await Tweet.findById(tweetID)

        if (!notFound) {
            return next(createError(400, 'Tweet not found.'))
        }

        await User.findOneAndUpdate({_id: userID}, {
            $pull: {
                myTweets: tweetID
            }
        })

        await Tweet.findOneAndDelete({_id: tweetID})

        return res.status(202).json({
            status: 'ok',
            msg: 'Successfully Deleted.'
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

}