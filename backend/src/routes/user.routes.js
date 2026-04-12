/**
 * @module UserRoutes
 * @description Felhasználói adatbázis kezeléséért felelős útvonalak szigorú hozzáférés-szabályozással.
 */

const express = require("express")
const router = express.Router()
const userController = require('../controllers/user.controller')
const {verifyToken, verifyAdmin} = require("../middleware/auth.middleware")

/**
 * @route POST /users
 * @group Users
 * @description Új felhasználó regisztrációja.
 * @access Public
 */
router.post("/", userController.createUser)

/**
 * @route GET /users
 * @group Users
 * @description Az összes felhasználó listázása (pl. admin panelhez).
 * @access Private (Csak Adminisztrátoroknak)
 */
router.get("/", verifyToken, verifyAdmin, userController.getAllUsers);

/**
 * @route GET /users/:id
 * @group Users
 * @description Egy konkrét felhasználó adatainak lekérése.
 * @access Private (Bejelentkezett felhasználóknak)
 */
router.get("/:id", verifyToken, userController.getUserById);

/**
 * @route PUT /users/:id
 * @group Users
 * @description Felhasználói profil módosítása (név, email, jelszó).
 * @access Private (Saját profil vagy Admin)
 */
router.put("/:id", verifyToken, userController.updateUser);

/**
 * @route DELETE /users/:id
 * @group Users
 * @description Felhasználó végleges eltávolítása a rendszerből.
 * @access Private (Csak Adminisztrátoroknak)
 */
router.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser);

module.exports = router;