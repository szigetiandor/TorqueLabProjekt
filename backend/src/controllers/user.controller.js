const userService = require('../services/user.service')

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, is_admin } = req.body

        if (!name) return res.status(400).json({ error: "Name is required" })
        if (!email) return res.status(400).json({ error: "Email is required" })
        if (!password) return res.status(400).json({ error: "Password is required" })

        if (password.length < 10) {
            return res.status(400).json({ error: "Password needs to be at least 10 characters" })
        }

        // Átadjuk az is_admin-t is (alapértelmezett a false/0)
        const user = await userService.createUser({ name, email, password, is_admin: is_admin || false })
        res.status(201).json(user)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

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

exports.updateUser = async (req, res) => {
    try {
        // Átvesszük az összes lehetséges mezőt
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