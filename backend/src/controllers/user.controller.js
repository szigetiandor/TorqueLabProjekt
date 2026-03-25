const userService = require('../services/user.service')

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name) {
            return res.status(400).json({ error: "Name is required" })
        }

        if (!email) {
            return res.status(400).json({ error: "email is required" })
        }

        if (!password) {
            console.log(password)
            return res.status(400).json({ error: "password is required" })
        }

        if (password.length <= 10) {
            return res.status(400).json({ error: "password needs to be longer than 10 characters" })
        }

        const user = await userService.createUser({ name, email, password })

        //console.log(user)

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
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id)

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json(user)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const updated = await userService.updateUser(req.params.id, { name, email, password })

        if (!updated) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json(updated)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deleted = userService.deleteUser(req.params.id)

        if (!deleted) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json(deleted)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}