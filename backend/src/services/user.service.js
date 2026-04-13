/**
 * @module UserService
 * @description Felhasználókezelés, jelszó-biztonság és JWT alapú hitelesítés üzleti logikája.
 */

const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * Új felhasználó regisztrációja biztonsági ellenőrzésekkel.
 * @async
 * @param {Object} params - Regisztrációs adatok.
 * @param {string} params.name - Név.
 * @param {string} params.email - Email cím (egyediség ellenőrzött).
 * @param {string} params.password - Nyers jelszó (hashelésre kerül).
 * @param {boolean} [params.is_admin=false] - Jogosultsági szint.
 * @throws {Error} Ha az email formátuma rossz, a jelszó rövid, vagy az email már foglalt.
 * @returns {Promise<Object>} A létrehozott felhasználó.
 */
exports.createUser = async ({ name, email, password, is_admin }) => {
    
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

/**
 * Összes felhasználó lekérése.
 * @async
 */
exports.getAllUsers = async () => {
    return await userModel.findAll();
}

/**
 * Felhasználó keresése ID alapján.
 * @async
 */
exports.getUserById = async (id) => {
    return await userModel.findById(id);
}

/**
 * Felhasználói adatok frissítése, opcionális jelszómódosítással.
 * @async
 * @param {number|string} id - Felhasználó ID.
 * @param {Object} data - Frissítendő adatok.
 * @throws {Error} Ha a felhasználó nem létezik vagy az új jelszó túl rövid.
 */
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

/**
 * Felhasználó törlése.
 * @async
 */
exports.deleteUser = async (id) => {
    return await userModel.remove(id);
}

/**
 * Felhasználó hitelesítése (Login).
 * @async
 * @param {string} email - Bejelentkezési email.
 * @param {string} password - Nyers jelszó az ellenőrzéshez.
 * @returns {Promise<{user: Object, token: string}|null>} User objektum és JWT token, vagy null sikertelen belépésnél.
 */
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