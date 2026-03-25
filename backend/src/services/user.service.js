const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createUser = async ({ name, email, password }) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)
    //console.log(passwordHash)
    const user = new userModel.User({ name, email, password_hash: passwordHash, is_admin: false })
    //console.log("in user service:")
    //console.log(user)
    return await userModel.create(user);
}

exports.getAllUsers = async () => {
    return await userModel.findAll();
}

exports.getUserById = async (id) => {
    return await userModel.findById(id);
}

exports.updateUser = async (id, data) => {
    const {name, email, password} = data
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)
    return await userModel.update(id, new userModel.User({name, email, password_hash: passwordHash, is_admin: false}));
}

exports.deleteUser = async (id) => {
    return await userModel.remove(id);
}

exports.loginUser = async (email, password) => {
    const user = await userModel.findByEmail(email)

    if (!user) {
        return null
    }

    //console.log(password)
    //console.log(user._password_hash)
    //console.log(bcrypt.compare(password, user._password_hash))

    const isPasswordCorrect = await bcrypt.compare(password, user._password_hash)

    if (!isPasswordCorrect) {
        return null
    }

    const token = jwt.sign(
        user.toJSON(), 
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    )

    return {user, token}
}

exports.becomeAdmin = async (id, adminSecret) => {
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return null
    }

    return await userModel.makeAdmin(id)
}