import {Router} from 'express'
const router = Router()

// Controllers
import {getAllUsers, editUserRole, dashboardInfo, getUserInfo} from '../../controllers/users/users'

// Auth
import {authJWT} from '../../auth/auth'

router.get('/allusers', authJWT, getAllUsers)
router.patch('/editrole/:userID', editUserRole)
router.get('/getallinfo', authJWT, dashboardInfo)
router.get('/getuserinfo/:userID', getUserInfo)

export default router