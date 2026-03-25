const express = require("express");
const router = express.Router();
const servicePartController = require("../controllers/servicePart.controller")

router.post("/", servicePartController.createServicePart);
router.get("/", servicePartController.getAllServiceParts);
router.get("/:id", servicePartController.getServicePartById);
router.put("/:id", servicePartController.updateServicePart);
router.delete("/:id", servicePartController.deleteServicePart);

module.exports = router;

