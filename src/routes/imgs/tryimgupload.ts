import {Router, Request, Response, NextFunction} from 'express'
const router = Router()
import createError from 'http-errors'
import multer from 'multer'
const upload = multer()

router.post('/tryupload', upload.single('img'), async (req: Request, res: Response, next: NextFunction) => {

    try {

        res.status(200).json({
            msg: 'Image Uploaded!'
        })
        
    } catch (err) {
        next(createError('Please try again.'))
    }

})

export default router