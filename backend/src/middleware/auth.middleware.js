/**
 * @module AuthMiddleware
 * @description Biztonsági middleware-ek a JWT tokenek ellenőrzéséhez és a jogosultságkezeléshez.
 */

const jwt = require('jsonwebtoken')

/**
 * Segédfüggvény a JWT token kinyeréséhez az Authorization fejlécből.
 * @param {Object} request_headers - A kérés fejlécei.
 * @returns {string|null} A kinyert token vagy null, ha nem található.
 */
function getToken(request_headers) {
  const authHeader = request_headers['authorization']
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  return token
}

/**
 * Middleware a felhasználó hitelességének ellenőrzéséhez.
 * Megvizsgálja a sütiket (Cookies) és az Authorization fejlécet is.
 * * @param {Object} req - Express kérés objektum.
 * @param {Object} res - Express válasz objektum.
 * @param {Function} next - A következő middleware függvény a láncban.
 */
exports.verifyToken = (req, res, next) => {
  // Elsőként a sütikben keresi a tokent, ha nincs, nézi a fejlécet
  const token = req.cookies?.token ?? getToken(req.headers)

  if (!token) {
    return res.status(403).json({error: 'no token provided'})
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    /** * A dekódolt adatokat (pl. user_id, is_admin) hozzácsatoljuk a kéréshez,
     * így a későbbi kontrollerek már tudni fogják, ki a kérést indító fél.
     */
    req.user = decoded
    next()
  }
  catch (err) {
    console.log(err.message)
    return res.status(401).json({error: 'unauthorized'})
  }
}

/**
 * Middleware az adminisztrátori jogosultság ellenőrzéséhez.
 * Csak a verifyToken middleware után használható!
 * * @param {Object} req - Express kérés objektum (tartalmaznia kell a req.user-t).
 * @param {Object} res - Express válasz objektum.
 * @param {Function} next - A következő middleware függvény a láncban.
 */
exports.verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'unauthorized, login required' })
  }

  
  if (!req.user.is_admin) {
    return res.status(401).json({error: 'unauthorized, admin access required'})
  }

  next()
}