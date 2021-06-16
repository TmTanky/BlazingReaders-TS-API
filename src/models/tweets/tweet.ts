import {model, Schema} from 'mongoose'

// Interfaces
import { Itweet } from '../../interfaces/tweets'

const tweetSchema = new Schema({
    content: String,
    tweetBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })

export const Tweet = model<Itweet>('Tweet', tweetSchema)