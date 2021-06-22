import {Router} from 'express'

const router = Router()

// Auth
import {authJWT} from '../../auth/auth'

// Controllers
import {createTweet, deleteTweet} from '../../controllers/tweets/tweet'

router.post('/createtweet/:userID', authJWT, createTweet)
router.delete('/deletetweet/:userID/:tweetID', authJWT, deleteTweet)

export default router