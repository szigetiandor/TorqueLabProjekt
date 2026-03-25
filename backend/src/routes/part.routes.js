const express = require("express");
const router = express.Router();
const partController = require("../controllers/part.controller")

router.post("/", partController.createPart);
router.get("/", partController.getAllParts);
router.get("/:id", partController.getPartById);
router.put("/:id", partController.updatePart);
router.delete("/:id", partController.deletePart);

module.exports = router;

