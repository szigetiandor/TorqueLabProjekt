/**
 * @module ServicePartRoutes
 * @description Szerviznaplókhoz rendelt alkatrészek (felhasznált anyagok) kezeléséért felelős útvonalak, adminisztrátori védelemmel.
 */

const express = require("express");
const router = express.Router();
const servicePartController = require("../controllers/servicePart.controller")
const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware")

/**
 * @route POST /service-parts
 * @group ServiceParts
 * @description Új alkatrészfelhasználás rögzítése egy konkrét szerviznaplóhoz.
 * @access Private
 */
router.post("/", verifyToken, servicePartController.createServicePart);

/**
 * @route GET /service-parts
 * @group ServiceParts
 * @description Az összes szerviz-alkatrész összerendelés lekérése.
 * @access Public
 */
router.get("/", servicePartController.getAllServiceParts);

/**
 * @route GET /service-parts/:id
 * @group ServiceParts
 * @description Egy konkrét alkatrészfelhasználási tétel lekérése azonosító alapján.
 * @access Public
 */
router.get("/:id", servicePartController.getServicePartById);

/**
 * @route PUT /service-parts/:id
 * @group ServiceParts
 * @description Felhasznált alkatrész adatainak (pl. módosított mennyiség vagy ár) frissítése.
 * @access Private (Csak Adminisztrátoroknak)
 */
router.put("/:id", verifyToken, verifyAdmin, servicePartController.updateServicePart);

/**
 * @route DELETE /service-parts/:id
 * @group ServiceParts
 * @description Alkatrészfelhasználás törlése a munkalapról.
 * @access Private (Csak Adminisztrátoroknak)
 */
router.delete("/:id", verifyToken, verifyAdmin, servicePartController.deleteServicePart);

module.exports = router;