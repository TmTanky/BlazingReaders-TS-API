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
    role: String
})

export const User = model<Iuser>('User', userSchema)