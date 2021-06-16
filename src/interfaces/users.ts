import { Document } from 'mongoose'
import { Iblog } from './posts';
import { Itweet } from './tweets';

export interface Iuser extends Document {
    firstName: string
    lastName: string
    email: string
    password: string
    myBlogs: Iblog[]
    role: string,
    followers: Iuser[]
    following: Iuser[]
    myTweets: Itweet[]
}