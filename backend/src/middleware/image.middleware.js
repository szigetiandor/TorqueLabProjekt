const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|webp/
    const ext = types.test(path.extname(file.originalname).toLowerCase())
    const mimetype = types.test(file.mimetype)

    //console.log(ext)
    //console.log(mimetype)
    //console.log('hello')

    if (!ext || !mimetype) {
      return cb(null, false)
    }

    return cb(null, true)
  }
})

