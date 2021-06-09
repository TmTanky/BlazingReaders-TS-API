import { model, Schema } from 'mongoose'

// Interfaces
import { Iblog } from '../../interfaces/posts'

const blogSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    content: String,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })

export const Blog = model<Iblog>('Blog', blogSchema)