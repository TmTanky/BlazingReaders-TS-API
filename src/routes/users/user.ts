import {Router} from 'express'
const router = Router()

// Controllers
import {getAllUsers, editUserRole, getAllInfo} from '../../controllers/users/users'

// Auth
import {authJWT} from '../../auth/auth'

router.get('/allusers', authJWT, getAllUsers)
router.patch('/editrole/:userID', editUserRole)
router.get('/getallinfo', authJWT, getAllInfo)

export default router