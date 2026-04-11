const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const serviceCommentController = require('../controllers/serviceComment.controller')

router.post('/',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  serviceCommentController.createServiceComment
)

router.get('/',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  serviceCommentController.getAllServiceComments
)

router.get('/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  serviceCommentController.getServiceCommentById
)

router.put('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  serviceCommentController.updateServiceComment
)

router.delete('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  serviceCommentController.deleteServiceComment
)

module.exports = router