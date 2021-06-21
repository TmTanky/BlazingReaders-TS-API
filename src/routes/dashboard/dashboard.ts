import {Router} from 'express'
const router = Router()

// Controllers
import {dashboardInfo, getMyBlogs} from '../../controllers/dashboard/dashboard'

// Auth
import {authJWT} from '../../auth/auth'

router.get('/dashboard/:userID', dashboardInfo)
router.get('/getmyblogs/:userID', authJWT, getMyBlogs)

export default router