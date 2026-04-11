const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller')
const authMiddleware = require('../middleware/auth.middleware')
const imageMiddleware = require('../middleware/image.middleware')

router.post('/', authMiddleware.verifyToken, imageMiddleware.upload.single('image'), imageController.createImage)
router.get('/', authMiddleware.verifyToken, imageController.getAllImages)
router.get('/file/:name', authMiddleware.verifyToken, imageController.getFile)
router.delete('/:id', authMiddleware.verifyToken, imageController.deleteImage)
router.put('/:id', authMiddleware.verifyToken, imageController.updateImage)
router.get('/:id', authMiddleware.verifyToken, imageController.getImageById)

module.exports = router