/**
 * @module UserController
 * @description Felhasználói fiókok kezeléséért felelős kontroller (CRUD műveletek).
 */

const userService = require('../services/user.service')

/**
 * Új felhasználó létrehozása (Regisztráció).
 * Tartalmazza a kötelező mezők ellenőrzését és a jelszó komplexitási vizsgálatát.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.body - A felhasználó adatai.
 * @param {string} req.body.name - A felhasználó teljes neve.
 * @param {string} req.body.email - A felhasználó email címe.
 * @param {string} req.body.password - A választott jelszó (min. 10 karakter).
 * @param {boolean} [req.body.is_admin=false] - Adminisztrátori jogosultság beállítása.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 201-es kód és a létrehozott felhasználó JSON objektuma.
 */
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, is_admin } = req.body

        if (!name) return res.status(400).json({ error: "Name is required" })
        if (!email) return res.status(400).json({ error: "Email is required" })
        if (!password) return res.status(400).json({ error: "Password is required" })

        if (password.length < 10) {
            return res.status(400).json({ error: "Password needs to be at least 10 characters" })
        }

        const user = await userService.createUser({ name, email, password, is_admin: is_admin || false })
        res.status(201).json(user)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

/**
 * Lekéri az összes regisztrált felhasználót a rendszerből.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON lista az összes felhasználóról.
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/**
 * Egy konkrét felhasználó lekérése azonosító alapján.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A felhasználó egyedi azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON objektum a felhasználó adataival.
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id)
        if (!user) return res.status(404).json({ error: "User not found" })
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/**
 * Meglévő felhasználó adatainak módosítása (Név, Email, Jelszó vagy Admin státusz).
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A módosítandó felhasználó azonosítója.
 * @param {Object} req.body - A frissítendő mezők.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} A frissített felhasználó adatai JSON-ben.
 */
exports.updateUser = async (req, res) => {
    try {
        const { name, email, password, is_admin } = req.body
        const updated = await userService.updateUser(req.params.id, { name, email, password, is_admin })

        if (!updated) return res.status(404).json({ error: "User not found" })
        res.json(updated)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

/**
 * Felhasználói fiók végleges törlése a rendszerből.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A törlendő felhasználó azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} Sikerüzenet vagy hibaüzenet.
 */
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await userService.deleteUser(req.params.id)
        if (!deleted) return res.status(404).json({ error: "User not found" })
        res.json({ message: "User deleted successfully" })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}