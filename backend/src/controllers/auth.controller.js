/**
 * @module AuthController
 * @description Felhasználói hitelesítést, jogosultságkezelést és munkamenet-kezelést végző vezérlő.
 */

const userService = require('../services/user.service')

/**
 * Bejelentkezteti a felhasználót és beállítja a hitelesítési sütit.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.body - A kérés törzse.
 * @param {string} req.body.email - A felhasználó email címe.
 * @param {string} req.body.password - A felhasználó jelszava.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON válasz a felhasználói adatokkal és a HTTP-only sütivel.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }

    const result = await userService.loginUser(email, password)
    if (!result) {
      return res.status(404).json({ error: 'user not found' })
    }

    const { user, token } = result
    if (!token || !user) {
      return res.status(401).json({ error: 'invalid credentials' })
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
      .json({ user })
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Ellenőrzi a felhasználó bejelentkezési állapotát a middleware által csatolt adatok alapján.
 * * @async
 * @param {Object} req - Express kérés objektum, tartalmazza a req.user-t (auth middleware-ből).
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON válasz a hitelesített felhasználó adataival.
 */
exports.verifyLogin = async (req, res) => {
  try {
    res.status(200).json({ user: req.user })
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Ellenőrzi, hogy a bejelentkezett felhasználó rendelkezik-e admin jogosultsággal.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON válasz az admin adatokkal.
 */
exports.verifyAdmin = async (req, res) => {
  try {
    res.status(200).json({ user: req.user })
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Admin jogosultságot ad a felhasználónak egy titkos kulcs ellenében.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.body.adminSecret - Az admin ranghoz szükséges titkos kód.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON válasz a sikerességről és a frissített felhasználói adatokról.
 */
exports.becomeAdmin = async (req, res) => {
  try {
    const { adminSecret } = req.body
    const user = await userService.becomeAdmin(req.user.userId, adminSecret)
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }
    res.status(200).json({ success: true, user })
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Kijelentkezteti a felhasználót a hitelesítési süti törlésével.
 * * @param {Object} req - Express kérés objektum.
 * @param {Object} res - Express válasz objektum.
 * @returns {Object} JSON üzenet a sikeres kijelentkezésről.
 */
exports.logout = (req, res) => {
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
  return res.status(200).json({ message: 'Logged out successfully' });
}