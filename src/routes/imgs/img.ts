import multer from 'multer'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/`)
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname.split('.')[0]}.jpeg`)
    }
})

export const upload = multer({storage, fileFilter(req, file, cb) {
    
    if (file.mimetype === 'image/png') {
        return cb(new Error ('JPEG only.'))
    }

    return cb(null, true)


}}).single('img')

// const router = Router()

// router.post('/imgupload', upload.single('img'), async (req: Request, res: Response, next: NextFunction) => {

//     try {

//         console.log(req.file)
//         res.status(200).json({
//             msg: 'Image Uploaded!'
//         })
        
//     } catch (err) {
//         next(createError('Please try again.'))
//     }

// })

// export default router