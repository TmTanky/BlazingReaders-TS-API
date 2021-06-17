import {Router} from 'express'
const router = Router()

// Controllers
import {getAllUsers, editUserRole, dashboardInfo, getUserInfo, followAndUnfollow, editName, editEmail, editPassword} from '../../controllers/users/users'

// Auth
import {authJWT} from '../../auth/auth'

router.get('/allusers', authJWT, getAllUsers)
router.get('/getallinfo', authJWT, dashboardInfo)
router.get('/getuserinfo/:userID', getUserInfo)
router.patch('/followunfollow/:userID/:otherID', authJWT, followAndUnfollow)
router.patch('/editrole/:userID', editUserRole)
router.patch('/editname/:userID', authJWT, editName)
router.patch('/editemail/:userID', authJWT, editEmail)
router.patch('/editpassword/:userID', authJWT, editPassword)

export default router