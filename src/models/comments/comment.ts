import { model, Schema } from 'mongoose'

// Interfaces
import { Icomment } from '../../interfaces/comments'

const commentSchema = new Schema({
    content: String,
    commentedOn: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
    commentBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

export const Comment = model<Icomment>('Comment', commentSchema)