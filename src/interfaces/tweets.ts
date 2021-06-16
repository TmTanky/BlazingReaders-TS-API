import {Document} from 'mongoose'

// Interfaces
import { Iuser } from './users';

export interface Itweet extends Document {
    content: string
    tweetBy: Iuser
    likes: Iuser[]
    comments: Iuser[]
}