import {Router} from 'express'

const router = Router()

// Auth
import {authJWT} from '../../auth/auth'

// Controllers
import {createTweet} from '../../controllers/tweets/tweet'

router.post('/createtweet/:userID', authJWT, createTweet)

export default router