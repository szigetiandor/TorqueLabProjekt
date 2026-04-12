/**
 * @module Database
 * @description MSSQL adatbázis-kapcsolat kezelése és konfigurációja.
 */

const sql = require("mssql");
const dotenv = require("dotenv/config")

/**
 * Adatbázis kapcsolódási konfiguráció.
 * A környezeti változókat a dotenv tölti be.
 * @type {Object}
 */
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  options: {
    encrypt: false, 
    trustServerCertificate: true, // Helyi fejlesztésnél szükséges a tanúsítvány elfogadásához
  },
};

/**
 * Létrehoz egy kapcsolati készletet (pool) vagy visszaadja a már meglévőt.
 * @async
 * @returns {Promise<sql.ConnectionPool>} Az aktív MSSQL kapcsolati készlet.
 */
async function getPool() {
  return await sql.connect(config);
}

/**
 * Teszteli az adatbázis elérhetőségét az alkalmazás indulásakor.
 * @async
 * @returns {Promise<Object>} Kapcsolódási állapot és hibaüzenet (ha van).
 */
async function testConnection() {
  try {
    const pool = await getPool();
    // Sikeres kapcsolódás után azonnal lezárjuk a teszt kapcsolatot
    await pool.close();
    return { connection: true, error: null };
  } catch (err) {
    return { connection: false, error: err.message };
  }
}

module.exports = { sql, getPool, testConnection };