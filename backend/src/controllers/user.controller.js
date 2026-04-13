/**
 * @module UserController
 * @description Felhasználói fiókok kezeléséért felelős kontroller, beépített tulajdonosi és adminisztrátori védelemmel.
 */

const userService = require('../services/user.service')

/**
 * Belső segédfüggvény a művelet végrehajtójának ellenőrzéséhez.
 * Megakadályozza a horizontális jogosultság-kiterjesztést (IDOR).
 * * @function hasAccess
 * @param {Object} req - Az Express kérés objektum, amely tartalmazza a dekódolt user adatokat.
 * @param {string} targetId - A kért erőforrás (felhasználó) egyedi azonosítója.
 * @returns {boolean} True, ha a kérést indító személy Admin VAGY a kért ID a sajátja.
 */
const hasAccess = (req, targetId) => {
    
    return req.user.is_admin || String(req.user.user_id) === String(targetId);
};

/**
 * Új felhasználó létrehozása (Regisztráció).
 * * @async
 * @function createUser
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.body - Regisztrációs adatok (name, email, password, is_admin).
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 201-es kód a létrehozott felhasználóval, vagy 400/500-as hiba.
 */
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, is_admin } = req.body
        if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" })
        if (password.length < 10) return res.status(400).json({ error: "Password min. 10 chars" })

        const user = await userService.createUser({ name, email, password, is_admin: is_admin || false })
        res.status(201).json(user)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/**
 * Az összes felhasználó listázása.
 * Kizárólag Adminisztrátorok számára elérhető útvonal.
 * * @async
 * @function getAllUsers
 * @param {Object} req - Express kérés objektum.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 200-as kód a felhasználók listájával.
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Ide csak Admin juthat el a route szintű védelem miatt.
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/**
 * Egy konkrét felhasználó adatainak lekérése.
 * Ellenőrzi, hogy a felhasználó a saját profilját kéri-e, vagy admin-e.
 * * @async
 * @function getUserById
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A célfelhasználó azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 200-as kód az adatokkal, vagy 403 Forbidden / 404 Not Found.
 */
exports.getUserById = async (req, res) => {
    try {
        
        if (!hasAccess(req, req.params.id)) {
            return res.status(403).json({ error: "Access denied. You can only view your own profile." })
        }

        const user = await userService.getUserById(req.params.id)
        if (!user) return res.status(404).json({ error: "User not found" })
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/**
 * Felhasználói profil módosítása.
 * Szigorú védelem: sima felhasználó nem adhat magának admin jogot, és nem módosíthat másokat.
 * * @async
 * @function updateUser
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A módosítandó felhasználó azonosítója.
 * @param {Object} req.body - A módosítandó mezők (name, email, password, is_admin).
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 200-as kód a frissített objektummal.
 */
exports.updateUser = async (req, res) => {
    try {
        
        if (!hasAccess(req, req.params.id)) {
            return res.status(403).json({ error: "Access denied. You can only update your own profile." })
        }

        const { name, email, password, is_admin } = req.body
        
        // EXTRA VÉDELEM: Sima felhasználó ne tudja magát Adminná léptetni
        let finalAdminStatus = is_admin;
        if (!req.user.is_admin) {
            finalAdminStatus = req.user.is_admin; 
        }

        const updated = await userService.updateUser(req.params.id, { 
            name, 
            email, 
            password, 
            is_admin: finalAdminStatus 
        })

        if (!updated) return res.status(404).json({ error: "User not found" })
        res.json(updated)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/**
 * Felhasználói fiók végleges törlése.
 * * @async
 * @function deleteUser
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A törlendő felhasználó azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 200-as kód sikerüzenettel.
 */
exports.deleteUser = async (req, res) => {
    try {
        
        if (!hasAccess(req, req.params.id)) {
            return res.status(403).json({ error: "Access denied. You can only delete your own account." })
        }

        const deleted = await userService.deleteUser(req.params.id)
        if (!deleted) return res.status(404).json({ error: "User not found" })
        res.json({ message: "User deleted successfully" })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}