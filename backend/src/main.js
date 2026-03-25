const express = require('express');
const dotenv = require("dotenv/config")
const database = require("./database")
const app = require("./app")
const cors = require('cors'); 

app.use(cors())
//uj dotenv
require('dotenv').config(); 

app.listen(process.env.BACKEND_PORT, async () => {
    console.log(`Backend is running on: ${process.env.BACKEND_PORT}`)
    const {connection, error} = await database.testConnection()
    console.log(`Connection to SQL server: ${connection}.`)
    if (error) {
        console.log(`Error: ${error}`)
    }
})