/**
 * @module ServicePartModel
 * @description A szerviznaplókhoz rendelt konkrét alkatrészek adatbázis-műveleteit (DAO) kezelő modul.
 */

const { getPool } = require("../database");

/**
 * Szerviz-alkatrész kapcsolat entitás osztály.
 * Egy konkrét szervizelés során felhasznált alkatrész adatait reprezentálja.
 */
class ServicePart {
  /**
   * @param {Object} params - A kapcsolat tulajdonságai.
   * @param {number} params.service_id - A kapcsolódó szerviznapló azonosítója.
   * @param {number} params.part_id - A felhasznált alkatrész azonosítója.
   * @param {number} params.quantity - A felhasznált darabszám.
   * @param {number} params.unit_price - Az elszámolt egységár a szerviz időpontjában.
   */
  constructor({service_id, part_id, quantity, unit_price}) {
    this.service_id = service_id
    this.part_id = part_id
    this.quantity = quantity
    this.unit_price = unit_price
  }
}

/**
 * Új alkatrészfelhasználás rögzítése egy szerviznaplóhoz.
 * @async
 * @param {Object} servicePart - A felhasznált alkatrész adatai.
 * @returns {Promise<ServicePart>} A létrehozott ServicePart objektum.
 */
exports.create = async (servicePart) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("service_id", servicePart.service_id)
    .input("part_id", servicePart.part_id)
    .input("quantity", servicePart.quantity)
    .input("unit_price", servicePart.unit_price)
    .query(`INSERT INTO service_part (service_id, part_id, quantity, unit_price) 
            OUTPUT INSERTED.* VALUES (@service_id, @part_id, @quantity, @unit_price)`)
  return new ServicePart(result.recordset[0])
}

/**
 * Az összes szerviz-alkatrész összerendelés lekérése.
 * @async
 * @returns {Promise<ServicePart[]>}
 */
exports.findAll = async () => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM service_part");
  return result.recordset.map(x => new ServicePart(x))
}

/**
 * Egy konkrét felhasználási tétel lekérése egyedi azonosító alapján.
 * @async
 * @param {number|string} id - A szerviz_alkatrész kapcsolat azonosítója.
 * @returns {Promise<ServicePart|null>}
 */
exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("SELECT * FROM service_part WHERE service_part_id=@id");
  return result.recordset[0] ? new ServicePart(result.recordset[0]) : null
}

/**
 * Meglévő felhasználási tétel (pl. darabszám vagy ár) módosítása.
 * @async
 * @param {number|string} id - A rekord azonosítója.
 * @param {Object} servicePart - A frissítendő adatok.
 * @returns {Promise<ServicePart|null>}
 */
exports.update = async (id, servicePart) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .input("service_id", servicePart.service_id)
    .input("part_id", servicePart.part_id)
    .input("quantity", servicePart.quantity)
    .input("unit_price", servicePart.unit_price)
    .query(`UPDATE service_part SET service_id=@service_id, part_id=@part_id, quantity=@quantity, unit_price=@unit_price 
            OUTPUT INSERTED.* WHERE service_part_id=@id`);
  return result.recordset[0] ? new ServicePart(result.recordset[0]) : null
}

/**
 * Alkatrészfelhasználás törlése a szerviznaplóból.
 * @async
 * @param {number|string} id - A rekord azonosítója.
 * @returns {Promise<boolean>} True, ha történt törlés.
 */
exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM service_part WHERE service_part_id=@id");
  return result.rowsAffected[0] > 0
}

exports.ServicePart = ServicePart;