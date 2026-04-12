/**
 * @module AuthRoutes
 * @description Hitelesítési és jogosultságkezelési útvonalak (Login, Logout, Register, Verify).
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middleware/auth.middleware')

/**
 * @route POST /auth/login
 * @group Authentication
 * @description Felhasználó beléptetése és JWT token generálása.
 * @access Public
 */
router.post("/login", authController.login);

/**
 * @route POST /auth/register
 * @group Authentication
 * @description Új felhasználói fiók létrehozása.
 * @access Public
 */
router.post("/register", userController.createUser)

/**
 * @route POST /auth/verify-login
 * @group Authentication
 * @description Ellenőrzi, hogy a kliens rendelkezik-e érvényes munkamenettel (tokennel).
 * @access Private (Token szükséges)
 */
router.post("/verify-login", authMiddleware.verifyToken, authController.verifyLogin)

/**
 * @route POST /auth/verify-admin
 * @group Authentication
 * @description Ellenőrzi, hogy a bejelentkezett felhasználó adminisztrátori jogosultsággal rendelkezik-e.
 * @access Private (Admin token szükséges)
 */
router.post("/verify-admin", authMiddleware.verifyToken, authMiddleware.verifyAdmin, authController.verifyAdmin)

/**
 * @route POST /auth/become-admin
 * @group Authentication
 * @description (Fejlesztői/Admin) Végpont a felhasználó adminisztrátori előléptetéséhez.
 * @access Private (Token szükséges)
 */
router.post("/become-admin", authMiddleware.verifyToken, authController.becomeAdmin)

/**
 * @route POST /auth/logout
 * @group Authentication
 * @description Felhasználó kijelentkeztetése és a süti/munkamenet törlése.
 * @access Public/Private
 */
router.post("/logout", authController.logout);

module.exports = router;