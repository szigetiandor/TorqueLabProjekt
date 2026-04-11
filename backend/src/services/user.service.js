const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createUser = async ({ name, email, password, is_admin }) => {
    // Üzleti logika: Email formátum és létezés ellenőrzése
    if (!email || !email.includes('@')) throw new Error("Érvénytelen email formátum!");
    if (!password || password.length < 6) throw new Error("A jelszónak legalább 6 karakternek kell lennie!");

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) throw new Error("Ez az email cím már foglalt!");

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const user = new userModel.User({ 
        name, 
        email, 
        password_hash: passwordHash, 
        is_admin: is_admin || false 
    });
    
    return await userModel.create(user);
};

exports.getAllUsers = async () => {
    return await userModel.findAll();
}

exports.getUserById = async (id) => {
    return await userModel.findById(id);
}

exports.updateUser = async (id, data) => {
    const existingUser = await userModel.findById(id);
    if (!existingUser) throw new Error("Felhasználó nem található!");

    const { name, email, password, is_admin } = data;
    
    let finalHash = existingUser._password_hash;
    if (password && password.trim() !== "") {
        if (password.length < 6) throw new Error("Az új jelszónak is legalább 6 karakternek kell lennie!");
        finalHash = await bcrypt.hash(password, 10);
    }

    const updatedUserObj = new userModel.User({
        user_id: id,
        name: name || existingUser.name,
        email: email || existingUser.email,
        password_hash: finalHash,
        is_admin: (is_admin !== undefined) ? is_admin : existingUser.is_admin
    });

    return await userModel.update(id, updatedUserObj);
};

exports.deleteUser = async (id) => {
    return await userModel.remove(id);
}

exports.loginUser = async (email, password) => {
    if (!email || !password) throw new Error("Email és jelszó megadása kötelező!");

    const user = await userModel.findByEmail(email);
    if (!user) return null;

    const isPasswordCorrect = await bcrypt.compare(password, user._password_hash);
    if (!isPasswordCorrect) return null;

    const token = jwt.sign(
        user.toJSON(), 
        process.env.JWT_SECRET || 'fallback_secret', 
        { expiresIn: '24h' }
    );
    return { user, token };
};