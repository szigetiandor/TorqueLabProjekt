/**
 * @module ServiceLogService
 * @description Szerviznaplók és kapcsolódó metaadatok (kommentek, tulajdonosi adatok) üzleti logikája.
 */

const serviceLogModel = require("../models/serviceLog.model")
const serviceCommentModel = require("../models/serviceComment.model")

/**
 * Új szerviznapló bejegyzés rögzítése.
 * @async
 * @param {Object} data - A munkalap adatai (autó ID, szerelő ID, dátum, leírás).
 * @returns {Promise<Object>}
 */
exports.createService = async (data) => {
  return await serviceLogModel.create(data)
}

/**
 * Az összes szervizbejegyzés lekérése.
 * @async
 * @returns {Promise<Array>}
 */
exports.getAllServices = async () => {
  return await serviceLogModel.findAll()
}

/**
 * Szerviznapló keresése egyedi azonosító alapján.
 * @async
 * @param {number|string} id - A szerviznapló azonosítója.
 */
exports.getServiceById = async (id) => {
  return await serviceLogModel.findById(id)
}

/**
 * Meglévő szerviznapló adatainak frissítése.
 * @async
 */
exports.updateService = async (id, data) => {
  return await serviceLogModel.update(id, data)
}

/**
 * Szerviznapló eltávolítása.
 * @async
 */
exports.deleteService = async (id) => {
  return await serviceLogModel.remove(id)
}

/**
 * Egy konkrét szerviz eseményhez tartozó összes hozzászólás lekérése.
 * @async
 * @param {number|string} serviceId - A szerviznapló azonosítója.
 * @returns {Promise<Array>} A kommentek listája a szerzők nevével.
 */
exports.getCommentsByServiceId = async (serviceId) => {
    // A Service réteg itt hídként szolgál egy másik modell felé
    const comments = await serviceCommentModel.findByServiceId(serviceId);  
    return comments;
};

/**
 * Egy autó tulajdonosához tartozó összes szerviztörténet lekérése.
 * @async
 * @param {number|string} ownerId - A tulajdonos felhasználói azonosítója.
 * @returns {Promise<Array>} Tartalmazza a szervizadatokat és az autók adatait is.
 */
exports.getLogsByOwner = async (ownerId) => {
  const logs = await serviceLogModel.findByOwnerId(ownerId);
  return logs;
}