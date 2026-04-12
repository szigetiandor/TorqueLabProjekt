/**
 * @module ServiceCommentModel
 * @description A szerviznaplókhoz tartozó hozzászólások adatbázis-műveleteit kezelő modul.
 */

const {getPool} = require('../database')

/**
 * Új szervizmegjegyzés mentése az adatbázisba.
 * @async
 * @param {Object} comment - A komment adatai.
 * @param {number} comment.by_user - A kommentelő felhasználó azonosítója.
 * @param {number} comment.service_id - A kapcsolódó szerviznapló azonosítója.
 * @param {string} comment.comment - A megjegyzés szövege.
 * @returns {Promise<Object>} A frissen beszúrt rekord adatai.
 */
exports.create = async (comment) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('by_user', comment.by_user)
    .input('service_id', comment.service_id)
    .input('comment', comment.comment)
    .query(`INSERT INTO service_comment (by_user, service_id, comment) OUTPUT INSERTED.* VALUES (@by_user, @service_id, @comment)`)
  return result.recordset[0]
}

/**
 * Az összes rendszerben lévő szervizmegjegyzés lekérése.
 * @async
 * @returns {Promise<Array>} Komment rekordok tömbje.
 */
exports.findAll = async () => {
  const pool = await getPool()
  const result = await pool
    .request()
    .query('SELECT * FROM service_comment')
  return result.recordset
}

/**
 * Egy konkrét megjegyzés lekérése azonosító alapján.
 * @async
 * @param {number|string} id - A komment egyedi azonosítója.
 * @returns {Promise<Object|null>} A megtalált rekord vagy null.
 */
exports.findById = async (id) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', id)
    .query(`SELECT * FROM service_comment WHERE service_comment_id = @id`)
  return result.recordset[0] ?? null
}

/**
 * Meglévő megjegyzés szövegének vagy szerzőjének módosítása.
 * @async
 * @param {number|string} id - A módosítandó rekord ID-ja.
 * @param {Object} comment - Az új adatok.
 * @returns {Promise<Object|null>} A frissített rekord.
 */
exports.update = async (id, comment) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .input("by_user", comment.by_user)
    .input("comment", comment.comment)
    .query(`UPDATE service_comment SET by_user=@by_user, comment=@comment OUTPUT INSERTED.* WHERE service_comment_id=@id`);
  return result.recordset[0] ?? null
}

/**
 * Megjegyzés törlése az adatbázisból.
 * @async
 * @param {number|string} id - A törlendő rekord azonosítója.
 * @returns {Promise<boolean>} True, ha a törlés sikeres volt.
 */
exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM service_comment WHERE service_comment_id=@id");
  return result.rowsAffected[0] > 0
}

/**
 * Egy konkrét szerviznaplóhoz (munkalaphoz) tartozó összes komment lekérése, 
 * a szerzők nevével együtt (JOIN művelet).
 * @async
 * @param {number|string} serviceId - A szerviznapló bejegyzés azonosítója.
 * @returns {Promise<Array>} A kommentek listája a szerzők nevével bővítve, időrendben csökkenve.
 */
exports.findByServiceId = async (serviceId) => {
      let pool = await getPool();
      let result = await pool.request()
        .input('serviceId', serviceId)
        .query(`
          SELECT 
            sc.service_comment_id,
            sc.comment,
            sc.by_user,
            u.name as user_name,
            sc.service_id
          FROM service_comment sc
          JOIN [user] u ON sc.by_user = u.user_id
          WHERE sc.service_id = @serviceId
          ORDER BY sc.service_comment_id DESC
        `);
      
      return result.recordset;
  }