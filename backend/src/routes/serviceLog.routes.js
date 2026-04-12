/**
 * @module ServiceLogRoutes
 * @description Szerviznaplók kezeléséért és a kapcsolódó adatok lekéréséért felelős útvonalak.
 */

const express = require("express");
const router = express.Router();
const serviceLogController = require("../controllers/serviceLog.controller")
const authMiddleware = require("../middleware/auth.middleware")

/**
 * @route GET /service-logs/my
 * @group ServiceLogs
 * @description A bejelentkezett felhasználó saját gépjárműveihez tartozó szerviztörténet lekérése.
 * @access Private (Minden bejelentkezett felhasználónak)
 */
router.get('/my', authMiddleware.verifyToken, serviceLogController.getMyServiceLogs);

/**
 * @route POST /service-logs
 * @group ServiceLogs
 * @description Új szerviznapló bejegyzés (munkalap) létrehozása.
 * @access Private
 */
router.post("/", 
  authMiddleware.verifyToken,
  serviceLogController.createServiceLog
);

/**
 * @route GET /service-logs
 * @group ServiceLogs
 * @description Az összes szerviznapló listázása.
 * @access Private (Token szükséges)
 */
router.get("/", authMiddleware.verifyToken, serviceLogController.getAllServiceLogs);

/**
 * @route GET /service-logs/:id
 * @group ServiceLogs
 * @description Egy konkrét szerviznapló részletes adatainak lekérése.
 * @access Private (Token szükséges)
 */
router.get("/:id", authMiddleware.verifyToken, serviceLogController.getServiceLogById);

/**
 * @route PUT /service-logs/:id
 * @group ServiceLogs
 * @description Meglévő szerviznapló módosítása.
 * @access Private (Csak Adminisztrátoroknak)
 */
router.put("/:id", 
  authMiddleware.verifyToken, 
  authMiddleware.verifyAdmin, 
  serviceLogController.updateServiceLog
);

/**
 * @route DELETE /service-logs/:id
 * @group ServiceLogs
 * @description Szerviznapló végleges törlése.
 * @access Private (Csak Adminisztrátoroknak)
 */
router.delete("/:id", 
  authMiddleware.verifyToken, 
  authMiddleware.verifyAdmin, 
  serviceLogController.deleteServiceLog
);

/**
 * @route GET /service-logs/:id/comments
 * @group ServiceLogs
 * @description Egy adott szerviznaplóhoz tartozó összes hozzászólás lekérése.
 * @access Private (Token szükséges)
 */
router.get('/:id/comments', 
  authMiddleware.verifyToken,
  serviceLogController.getServiceComments
);

module.exports = router;