import { Document } from 'mongoose'
import { Iblog } from './posts';

export interface Iuser extends Document {
    firstName: string
    lastName: string
    email: string
    password: string
    myBlogs: Iblog[]
    role: string,
    followers: Iuser[]
    following: Iuser[]
}