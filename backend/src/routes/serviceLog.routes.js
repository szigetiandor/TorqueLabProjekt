const express = require("express");
const router = express.Router();
const serviceLogController = require("../controllers/serviceLog.controller")

router.post("/", serviceLogController.createServiceLog);
router.get("/", serviceLogController.getAllServiceLogs);
router.get("/:id", serviceLogController.getServiceLogById);
router.put("/:id", serviceLogController.updateServiceLog);
router.delete("/:id", serviceLogController.deleteServiceLog);

module.exports = router;
