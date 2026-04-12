/**
 * @module ServiceCommentService
 * @description Szerviznaplókhoz fűzött megjegyzések üzleti logikája.
 */

const serviceCommentModel = require('../models/serviceComment.model')

/**
 * Új megjegyzés rögzítése egy szerviz eseményhez.
 * @async
 * @param {Object} data - A komment adatai (by_user, service_id, comment szöveg).
 * @returns {Promise<Object>} A mentett komment objektum.
 */
exports.createServiceComment = async (data) => {
  // Itt lehetne implementálni pl. egy trágárság-szűrőt vagy 
  // értesítést küldeni az autó tulajdonosának.
  return await serviceCommentModel.create(data)
}

/**
 * Rendszerszintű lista lekérése az összes hozzászólásról.
 * @async
 * @returns {Promise<Array>}
 */
exports.getAllServiceComments = async () => {
  return await serviceCommentModel.findAll()
}

/**
 * Konkrét hozzászólás keresése ID alapján.
 * @async
 * @param {number|string} id - A komment azonosítója.
 * @returns {Promise<Object|null>}
 */
exports.getServiceCommentById = async (id) => {
  return await serviceCommentModel.findById(id)
}

/**
 * Meglévő hozzászólás szövegének frissítése.
 * @async
 * @param {number|string} id - A frissítendő komment ID-ja.
 * @param {Object} data - Az új tartalom.
 * @returns {Promise<Object|null>}
 */
exports.updateServiceComment = async (id, data) => {
  return await serviceCommentModel.update(id, data)
}

/**
 * Hozzászólás végleges eltávolítása.
 * @async
 * @param {number|string} id - A törlendő komment ID-ja.
 * @returns {Promise<boolean>}
 */
exports.deleteServiceComment = async (id) => {
  return await serviceCommentModel.remove(id)
}