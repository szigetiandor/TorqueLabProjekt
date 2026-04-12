/**
 * @module PartRoutes
 * @description Alkatrészek kezeléséért felelős útvonalak szigorú jogosultságkezeléssel.
 */

const express = require("express");
const router = express.Router();
const partController = require("../controllers/part.controller")
const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware")

/**
 * @route POST /parts
 * @group Parts
 * @description Új alkatrész felvétele a raktárba.
 * @access Private (Adminisztrátoroknak)
 */
router.post("/", verifyToken, verifyAdmin, partController.createPart);

/**
 * @route GET /parts
 * @group Parts
 * @description Alkatrészek listázása keresési paraméterek alapján.
 * @access Public
 */
router.get("/", partController.getAllParts);

/**
 * @route GET /parts/:id
 * @group Parts
 * @description Egy specifikus alkatrész adatlapjának lekérése.
 * @access Public
 */
router.get("/:id", partController.getPartById);

/**
 * @route PUT /parts/:id
 * @group Parts
 * @description Alkatrész adatainak vagy raktárkészletének módosítása.
 * @access Private (Adminisztrátoroknak)
 */
router.put("/:id", verifyToken, verifyAdmin, partController.updatePart);

/**
 * @route DELETE /parts/:id
 * @group Parts
 * @description Alkatrész végleges eltávolítása a katalógusból.
 * @access Private (Adminisztrátoroknak)
 */
router.delete("/:id", verifyToken, verifyAdmin, partController.deletePart);

module.exports = router;