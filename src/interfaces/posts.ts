import { Document } from 'mongoose'

// Interfaces
import { Iuser } from './users';

export interface Iblog extends Document {
    createdBy: Iuser
    title: string
    content: string
    likes: Iuser[]
    comments: Iuser[]
}