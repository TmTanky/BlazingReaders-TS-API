import {Router} from 'express'
const router = Router()

// Controllers
import {createBlog, editBlog, deleteBlog, likeBlog, commentOnBlog} from '../../controllers/posts/post'
// Auth
import {authJWT} from '../../auth/auth'

router.post('/createblog/:userID', authJWT, createBlog)
router.patch('/editblog/:blogID', authJWT, editBlog)
router.delete('/deleteblog/:blogID', authJWT, deleteBlog)
router.patch('/likeblog/:userID/:blogID', authJWT, likeBlog)
router.post('/commentonblog/:userID/:blogID', authJWT, commentOnBlog)

export default router