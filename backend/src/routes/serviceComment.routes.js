/**
 * @module ServiceCommentRoutes
 * @description Szerviznaplóhoz tartozó hozzászólások kezeléséért felelős útvonalak.
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const serviceCommentController = require('../controllers/serviceComment.controller')

/**
 * @route POST /service-comments
 * @group ServiceComments
 * @description Új megjegyzés hozzáadása egy szerviznapló bejegyzéshez.
 * @access Private (Adminisztrátoroknak)
 */
router.post('/',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  serviceCommentController.createServiceComment
)

/**
 * @route GET /service-comments
 * @group ServiceComments
 * @description Az összes megjegyzés lekérése a rendszerből.
 * @access Private (Bejelentkezett felhasználóknak)
 */
router.get('/',
  authMiddleware.verifyToken,
  serviceCommentController.getAllServiceComments
)

/**
 * @route GET /service-comments/:id
 * @group ServiceComments
 * @description Egy konkrét megjegyzés lekérése azonosító alapján.
 * @access Private (Bejelentkezett felhasználóknak)
 */
router.get('/:id',
  authMiddleware.verifyToken,
  serviceCommentController.getServiceCommentById
)

/**
 * @route PUT /service-comments/:id
 * @group ServiceComments
 * @description Egy meglévő megjegyzés tartalmának módosítása.
 * @access Private (Adminisztrátoroknak)
 */
router.put('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  serviceCommentController.updateServiceComment
)

/**
 * @route DELETE /service-comments/:id
 * @group ServiceComments
 * @description Megjegyzés végleges törlése.
 * @access Private (Adminisztrátoroknak)
 */
router.delete('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  serviceCommentController.deleteServiceComment
)

module.exports = router