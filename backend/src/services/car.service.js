/**
 * @module CarService
 * @description Az autókhoz kapcsolódó üzleti logika és adatkezelés közvetítő rétege.
 */

const carModel = require("../models/car.model");

/**
 * Új autó mentése.
 * @async
 * @param {Object} data - Az autó adatai (brand, model, vin, price, stb.).
 * @returns {Promise<Object>} A létrehozott autó objektum.
 */
exports.createCar = async (data) => {
  return await carModel.create(data);
};

/**
 * Autók listázása szűrési feltételekkel.
 * @async
 * @param {string} [modelFilter] - Modell név alapú szűrés.
 * @param {string} [typeFilter] - Felépítmény típus szerinti szűrés.
 * @returns {Promise<Array>} A szűrt autók listája.
 */
exports.getAllCars = async (modelFilter, typeFilter) => {
  return await carModel.findAll(modelFilter, typeFilter);
};

/**
 * Autó lekérése azonosító alapján.
 * @async
 * @param {number|string} id - Az autó egyedi azonosítója.
 * @returns {Promise<Object|null>}
 */
exports.getCarById = async (id) => {
  return await carModel.findById(id);
};

/**
 * Meglévő autó adatainak frissítése.
 * @async
 * @param {number|string} id - A módosítandó autó ID-ja.
 * @param {Object} data - A frissítendő mezők.
 * @returns {Promise<Object|null>}
 */
exports.updateCar = async (id, data) => {
  return await carModel.update(id, data);
};

/**
 * Autó törlése a rendszerből.
 * @async
 * @param {number|string} id - A törlendő autó ID-ja.
 * @returns {Promise<boolean>} Igaz, ha a törlés sikeres volt.
 */
exports.deleteCar = async (id) => {
  return await carModel.remove(id);
};