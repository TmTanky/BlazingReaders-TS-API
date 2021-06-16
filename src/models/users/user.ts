import { model, Schema } from 'mongoose'

// Interfaces
import { Iuser } from '../../interfaces/users'

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    myBlogs: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    myTweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    role: String,
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })

export const User = model<Iuser>('User', userSchema)