/**
 * @module CarRoutes
 * @description Gépjárművek kezeléséért felelős útvonalak (Lekérdezés, Létrehozás, Módosítás, Törlés).
 */

const express = require("express");
const router = express.Router();
const carController = require("../controllers/car.controller");
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

/**
 * @route POST /cars
 * @group Cars
 * @description Új autó rögzítése a rendszerben.
 * @access Private
 */
router.post("/", verifyToken, carController.createCar);

/**
 * @route GET /cars
 * @group Cars
 * @description Az összes autó lekérése (opcionális szűrési feltételekkel a query stringben).
 * @access Public
 */
router.get("/", carController.getAllCars);

/**
 * @route GET /cars/:id
 * @group Cars
 * @description Egy konkrét autó részletes adatainak lekérése azonosító alapján.
 * @access Public
 */
router.get("/:id", carController.getCarById);

router.get("/vin/:vin", carController.getCarByVin);

/**
 * @route PUT /cars/:id
 * @group Cars
 * @description Meglévő autó adatainak módosítása.
 * @access Private
 */
router.put("/:id", verifyToken, carController.updateCar);

/**
 * @route DELETE /cars/:id
 * @group Cars
 * @description Autó végleges törlése a rendszerből.
 * @access Private
 */
router.delete("/:id", verifyToken, carController.deleteCar);

module.exports = router;