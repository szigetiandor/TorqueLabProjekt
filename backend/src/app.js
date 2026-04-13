const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")

const cors = require("cors") 

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(cookieParser())

// console.log(path.join(__dirname, '../public'))
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use('/api/users', require("./routes/user.routes"))
app.use('/api/cars', require("./routes/car.routes"))
app.use('/api/service-logs', require("./routes/serviceLog.routes"))
app.use('/api/parts', require("./routes/part.routes"))
app.use('/api/service-parts', require("./routes/servicePart.routes"))
app.use('/api/auth', require("./routes/auth.routes"))
app.use('/api/service-comments', require('./routes/serviceComment.routes'))
app.use('/api/images', require('./routes/image.routes'))

module.exports = app