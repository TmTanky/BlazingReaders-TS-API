import {Router} from 'express'
const router = Router()

// Controllers
import {createBlog, editBlog, deleteBlog, likeBlog, commentOnBlog, getAllBlogs, getOneBlog} from '../../controllers/posts/post'
import {upload} from '../../routes/imgs/img'
// Auth
import {authJWT} from '../../auth/auth'

router.get('/allblogs/:userID', getAllBlogs)
router.get('/getoneblog/:blogID', getOneBlog)
router.post('/createblog/:userID', authJWT, upload, createBlog)
router.patch('/editblog/:blogID', authJWT, editBlog)
router.delete('/deleteblog/:blogID', authJWT, deleteBlog)
router.patch('/likeblog/:userID/:blogID', authJWT, likeBlog)
router.post('/commentonblog/:userID/:blogID', authJWT, commentOnBlog)

export default router