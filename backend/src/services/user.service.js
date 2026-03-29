const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createUser = async ({ name, email, password, is_admin }) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new userModel.User({ 
        name, 
        email, 
        password_hash: passwordHash, 
        is_admin: is_admin || false 
    })
    return await userModel.create(user);
}

exports.getAllUsers = async () => {
    return await userModel.findAll();
}

exports.getUserById = async (id) => {
    return await userModel.findById(id);
}

exports.updateUser = async (id, data) => {
    const { name, email, password, is_admin } = data
    
    // 1. Megkeressük a meglévő felhasználót
    const existingUser = await userModel.findById(id);
    if (!existingUser) return null;

    // 2. Jelszó kezelése: csak ha küldtek újat, akkor titkosítunk
    let finalHash = existingUser._password_hash;
    if (password && password.trim() !== "") {
        const saltRounds = 10;
        finalHash = await bcrypt.hash(password, saltRounds);
    }

    // 3. Admin jog kezelése: ha a data-ban nincs benne (undefined), marad a régi
    const finalAdminStatus = (is_admin !== undefined) ? is_admin : existingUser.is_admin;

    // 4. Frissítés az új model példánnyal
    const updatedUserObj = new userModel.User({
        user_id: id,
        name: name || existingUser.name,
        email: email || existingUser.email,
        password_hash: finalHash,
        is_admin: finalAdminStatus
    });

    return await userModel.update(id, updatedUserObj);
}

exports.deleteUser = async (id) => {
    return await userModel.remove(id);
}

exports.loginUser = async (email, password) => {
    const user = await userModel.findByEmail(email)
    if (!user) return null
    const isPasswordCorrect = await bcrypt.compare(password, user._password_hash)
    if (!isPasswordCorrect) return null

    const token = jwt.sign(
        user.toJSON(), 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    )
    return { user, token }
}