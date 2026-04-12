/**
 * @file server.js
 * @description Az alkalmazás tényleges indítófájlja. Beállítja a portot és ellenőrzi az adatbázis kapcsolatot.
 */

const express = require('express');
const dotenv = require("dotenv/config");
const database = require("./database");
const app = require("./app");

/**
 * A HTTP szerver elindítása a .env fájlban megadott porton.
 */
app.listen(process.env.BACKEND_PORT, async () => {
    console.log(`--- SZERVER ÁLLAPOT ---`);
    console.log(`[OK] Backend fut a következő porton: ${process.env.BACKEND_PORT}`);

    /**
     * Adatbázis kapcsolat tesztelése induláskor.
     * Megakadályozza, hogy a szerver "vakon" fusson adatbázis nélkül.
     */
    const {connection, error} = await database.testConnection();
    
    if (connection) {
        console.log(`[OK] SQL Szerver kapcsolat: SIKERES`);
    } else {
        console.log(`[ERROR] SQL Szerver kapcsolat: HIBÁS`);
        console.log(`Hiba részletei: ${error}`);
    }
    console.log(`-----------------------`);
});