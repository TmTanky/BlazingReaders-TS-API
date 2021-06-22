import multer from 'multer'
import sharp from 'sharp'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/`)
    },
    filename: function (req, file, cb) {

        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname.split('.')[0]}.jpeg`)
    }
})

export const profileUpload = multer({storage, fileFilter(req, file, cb) {
    
    if (file.mimetype === 'image/png') {
        return cb(new Error ('JPEG only.'))
    }
    
    return cb(null, true)


}}).single('img')