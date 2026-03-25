const sql = require("mssql");
const dotenv = require("dotenv/config")

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  //port: parseInt(process.env.DB_PORT),
  options: {
    //instanceName: process.env.DB_INSTANCE,
    encrypt: false, 
    trustServerCertificate: true, 
  },
};

async function getPool() {
  return await sql.connect(config);
}

async function testConnection() {
  try {
    const pool = await getPool();
    await pool.close();
    return {connection: true, error: null};
  } catch (err) {
    return {connection: false, error: err.message};
  }
}

module.exports = { sql, getPool, testConnection };