/**
 * @module PartService
 * @description Alkatrészekkel és raktárkészlettel kapcsolatos üzleti logika.
 */

const partModel = require("../models/part.model")

/**
 * Új alkatrész rögzítése a rendszerbe.
 * @async
 * @param {Object} data - Az alkatrész adatai (név, gyártó, cikkszám, ár, készlet, leírás).
 * @returns {Promise<Object>} A létrehozott alkatrész objektuma.
 */
exports.createPart = async (data) => {
  return await partModel.create(data)
}

/**
 * Alkatrészek listázása komplex szűréssel.
 * @async
 * @param {string} [query] - Keresőszó a névben, gyártóban vagy leírásban való kereséshez.
 * @param {number} [price] - Maximális ár, ami alatt az alkatrészeket keressük.
 * @returns {Promise<Array>} A keresési feltételeknek megfelelő alkatrészek tömbje.
 */
exports.getAllParts = async (query, price) => {
  return await partModel.findAll(query, price)
}

/**
 * Alkatrész keresése egyedi azonosító alapján.
 * @async
 * @param {number|string} id - Az alkatrész azonosítója.
 * @returns {Promise<Object|null>} Az alkatrész adatai vagy null, ha nem található.
 */
exports.getPartById = async (id) => {
  return await partModel.findById(id)
}

/**
 * Meglévő alkatrész adatainak (pl. árváltozás vagy készletfrissítés) kezelése.
 * @async
 * @param {number|string} id - A frissítendő alkatrész ID-ja.
 * @param {Object} data - Az új adatok.
 * @returns {Promise<Object|null>}
 */
exports.updatePart = async (id, data) => {
  return await partModel.update(id, data)
}

/**
 * Alkatrész eltávolítása a katalógusból.
 * @async
 * @param {number|string} id - A törlendő tétel azonosítója.
 * @returns {Promise<boolean>} Igaz, ha a törlés sikeres volt.
 */
exports.deletePart = async (id) => {
  return await partModel.remove(id)
}