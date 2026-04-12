/**
 * @module ServiceLogModel
 * @description Szerviznapló bejegyzések (munkalapok) adatbázis-kezelő modulja.
 */

const { getPool } = require("../database")

/**
 * Szerviznapló entitás osztály.
 * Reprezentálja az elvégzett munka adatait.
 */
class ServiceLog {
  /**
   * @param {Object} params - A szerviznapló tulajdonságai.
   * @param {number} params.service_id - Elsődleges kulcs.
   * @param {number} params.car_id - Idegen kulcs az autóhoz.
   * @param {number} params.performed_by - Idegen kulcs a szerelőhöz (User).
   * @param {string|Date} params.service_date - A szervizelés dátuma.
   * @param {string} params.description - A munka leírása.
   * @param {string} params.status - A munka státusza.
   */
  constructor({ service_id, car_id, performed_by, service_date, description, status }) {
    this.service_id = service_id;
    this.car_id = car_id;
    this.service_date = service_date;
    this.description = description;
    this.performed_by = performed_by;
    this.status = status;
  }
}

/**
 * Új szerviznapló bejegyzés rögzítése.
 * @async
 * @param {Object} serviceLog - A szervizadatok objektuma.
 * @returns {Promise<ServiceLog>} A létrehozott ServiceLog példány.
 */
exports.create = async (serviceLog) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("car_id", serviceLog.car_id)
    .input("performed_by", serviceLog.performed_by)
    .input("service_date", serviceLog.service_date)
    .input("description", serviceLog.description)
    .query(`INSERT INTO service_log (car_id, performed_by, service_date, [description]) 
            OUTPUT INSERTED.* VALUES (@car_id, @performed_by, @service_date, @description)`)
  return new ServiceLog(result.recordset[0])
}

/**
 * Az összes szervizbejegyzés listázása.
 * @async
 * @returns {Promise<ServiceLog[]>}
 */
exports.findAll = async () => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM service_log");
  const res =  result.recordset.map(x => new ServiceLog(x))
  console.log(`DB-ben: ${JSON.stringify(res)}`)
  return res
}

/**
 * Egy konkrét szerviznapló lekérése azonosító alapján.
 * @async
 * @param {number|string} id - A szerviznapló ID-ja.
 * @returns {Promise<ServiceLog|null>}
 */
exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("SELECT * FROM service_log WHERE service_id=@id");
  return result.recordset[0] ? new ServiceLog(result.recordset[0]) : null
}

/**
 * Meglévő szervizbejegyzés adatainak módosítása.
 * @async
 * @param {number|string} id - A módosítandó rekord ID-ja.
 * @param {Object} serviceLog - Az új adatok.
 * @returns {Promise<ServiceLog|null>}
 */
exports.update = async (id, serviceLog) => {
  console.log(serviceLog.status);
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .input("car_id", serviceLog.car_id)
    .input("performed_by", serviceLog.performed_by)
    .input("service_date", serviceLog.service_date)
    .input("description", serviceLog.description)
    .input("status", serviceLog.status)
    .query(`UPDATE service_log SET car_id=@car_id, [status]=@status, performed_by=@performed_by, service_date=@service_date, [description]=@description 
            OUTPUT INSERTED.* WHERE service_id=@id`);

  console.log("DB-ből visszatérő adat:", result.recordset[0]);
  return result.recordset[0] ? new ServiceLog(result.recordset[0]) : null
}

/**
 * Szervizbejegyzés törlése.
 * @async
 * @param {number|string} id - A rekord azonosítója.
 * @returns {Promise<boolean>} True, ha a törlés sikeres volt.
 */
exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM service_log WHERE service_id=@id");
  return result.rowsAffected[0] > 0
}

/**
 * Egy adott tulajdonoshoz tartozó összes autó összes szervizbejegyzésének lekérése.
 * Összekapcsolja az adatokat az autókkal és a szerelőkkel.
 * @async
 * @param {number|string} ownerId - A gépjármű-tulajdonos azonosítója.
 * @returns {Promise<Array>} Tartalmazza a szervizadatokat, az autó adatait és a szerelő nevét is.
 */
exports.findByOwnerId = async (ownerId) => {
    try {
        let pool = await getPool();
        let result = await pool.request()
            .input('ownerId', ownerId)
            .query(`
                SELECT 
                    sl.*, 
                    c.brand, c.model, c.vin,
                    u_worker.name as worker_name
                FROM service_log sl
                JOIN car c ON sl.car_id = c.car_id
                LEFT JOIN [user] u_worker ON sl.performed_by = u_worker.user_id
                WHERE c.owner_id = @ownerId
                ORDER BY sl.service_date DESC
            `);
        return result.recordset;
    } catch (err) {
        throw err;
    }
}

exports.ServiceLog = ServiceLog;