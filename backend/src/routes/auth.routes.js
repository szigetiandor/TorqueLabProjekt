const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post("/login", authController.login);
router.post("/register", userController.createUser)
router.post("/verify-login", authMiddleware.verifyToken, authController.verifyLogin)
router.post("/verify-admin", authMiddleware.verifyToken, authMiddleware.verifyAdmin, authController.verifyAdmin)
router.post("/become-admin", authMiddleware.verifyToken, authController.becomeAdmin)

module.exports = router;