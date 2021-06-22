import {Router} from 'express'
const router = Router()

// Options
import createError from 'http-errors'
import multer from 'multer'
import {User} from '../../models/users/user'
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Controllers
import {getAllUsers, editUserRole, dashboardInfo, getUserInfo, followAndUnfollow, editName, editEmail, editPassword, editAvatar} from '../../controllers/users/users'
// import {profileUpload} from '../../routes/imgs/profileImg'

// Auth
import {authJWT} from '../../auth/auth'
import sharp from 'sharp'

router.get('/allusers', authJWT, getAllUsers)
router.get('/getallinfo', authJWT, dashboardInfo)
router.get('/getuserinfo/:userID', getUserInfo)
// router.patch('/editavatar/:userID', authJWT, profileUpload, editAvatar)
router.patch('/followunfollow/:userID/:otherID', authJWT, followAndUnfollow)
router.patch('/editrole/:userID', editUserRole)
router.patch('/editname/:userID', authJWT, editName)
router.patch('/editemail/:userID', authJWT, editEmail)
router.patch('/editpassword/:userID', authJWT, editPassword)

router.patch('/editavatar/:userID', upload.single('img'), async (req, res, next) => {

    const userID = req.params.userID

    try {

        const randomDate = Date.now()
        await sharp(req.file.buffer).resize(500, 500).toFile(`./public/${req.file.fieldname}-${randomDate}-${req.file.originalname.split('.')[0]}.jpeg`)

        if (!req.file) {
            return next(createError(400, 'Photo must be provided.'))
        }

        await User.findOneAndUpdate({_id: userID}, {
            avatar: `public\\${req.file.fieldname}-${randomDate}-${req.file.originalname.split('.')[0]}.jpeg`
        })

        return res.status(202).json({
            status: 'ok',
            msg: 'Avatar Changed Successfully'
        })
        
    } catch (err) {
        next(createError(400, 'Please try again.'))
    }

})

export default router