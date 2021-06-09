import {Document} from 'mongoose'

// Interfaces
import { Iblog } from './posts';
import { Iuser } from './users';

export interface Icomment {
    content: string
    commentedOn: Iblog
    commentBy: Iuser
}