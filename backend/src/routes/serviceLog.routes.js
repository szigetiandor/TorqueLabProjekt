const express = require("express");
const router = express.Router();
const serviceLogController = require("../controllers/serviceLog.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.get('/my', authMiddleware.verifyToken, serviceLogController.getMyServiceLogs);

router.post("/", serviceLogController.createServiceLog);
router.get("/", serviceLogController.getAllServiceLogs);
router.get("/:id", serviceLogController.getServiceLogById);
router.put("/:id", serviceLogController.updateServiceLog);
router.delete("/:id", serviceLogController.deleteServiceLog);

router.get('/:id/comments', 
  authMiddleware.verifyToken, 
  authMiddleware.verifyAdmin, 
  serviceLogController.getServiceComments
);

module.exports = router;
