const jwt = require('jsonwebtoken')

function getToken(request_headers) {
  const authHeader = request_headers['authorization']
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  return token
}

exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token ?? getToken(req.headers)

  if (!token) {
    return res.status(403).json({error: 'no token provided'})
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  }
  catch (err) {
    console.log(err.message)
    return res.status(401).json({error: 'unauthorized'})
  }
}

exports.verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'unauthorized, login required' })
  }

  // JAVÍTÁS: Itt is_admin-t kell nézni, mert a JWT-dben ez a kulcs!
  if (!req.user.is_admin) {
    return res.status(401).json({error: 'unauthorized, admin access required'})
  }

  next()
}