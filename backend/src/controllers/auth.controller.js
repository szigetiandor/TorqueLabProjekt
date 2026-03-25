const userService = require('../services/user.service')

exports.login = async (req, res) => {
  try {
    const {email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({error: 'email and password are required'})
    }

    const result = await userService.loginUser(email, password)
    
    if (!result) {
      return res.status(404).json({error: 'user not found'})
    }

    const {user, token} = result

    if (!token || !user) {
      return res.status(401).json({error: 'invalid credentials'})
    }

    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 óra
        sameSite: 'strict',
        path: '/'
      })
      .json({user})
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}

exports.verifyLogin = async (req, res) => {
  try {
    res.status(200).json({user: req.user})
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}

exports.verifyAdmin = async (req, res) => {
  try {
    res.status(200).json({user: req.user})
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}

exports.becomeAdmin = async (req, res) => {
  try {
    const {adminSecret} = req.body
    const user = await userService.becomeAdmin(req.user.userId, adminSecret)
    
    if (!user) {
      return res.status(404).json({error: 'user not found'})
    }

    res.status(200).json({success: true, user})
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}