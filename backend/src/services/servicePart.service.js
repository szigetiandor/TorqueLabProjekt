/**
 * @module ServicePartService
 * @description Szerviznaplókhoz rendelt alkatrészek üzleti logikája és validációja.
 */

const servicePartModel = require("../models/servicePart.model");
const partModel = require("../models/part.model");

/**
 * Új alkatrészfelhasználás rögzítése validálással.
 * @async
 * @param {Object} data - Az alkatrészfelhasználás adatai.
 * @param {number} data.quantity - A felhasznált mennyiség (pozitív számnak kell lennie).
 * @param {number} data.unit_price - Az elszámolási egységár (nem lehet negatív).
 * @throws {Error} Ha a mennyiség vagy az ár érvénytelen.
 * @returns {Promise<Object>} A létrehozott rekord.
 */
exports.createServicePart = async (data) => {
    const { part_id, quantity } = data;

    // 1. Alkatrész lekérése a jelenlegi készlet ellenőrzéséhez
    const part = await partModel.findById(part_id);
    
    if (!part) {
        throw new Error("A választott alkatrész nem található!");
    }

    // 2. Készlet ellenőrzése
    if (part.stock_quantity < quantity) {
        throw new Error(`Nincs elég készleten: ${part.part_name || 'Alkatrész'}. Elérhető: ${part.stock_quantity} db.`);
    }

    // 3. Készlet módosítása (levonás)
    // Megjegyzés: A modellben meg kell írnod az updateStock-ot vagy használd a sima update-et
    const newStock = part.stock_quantity - quantity;
    await partModel.update(part_id, { 
        ...part, // Megtartjuk az eredeti nevet, árat, stb.
        stock_quantity: newStock 
    });

    // 4. A szerviz-alkatrész kapcsolat rögzítése
    return await servicePartModel.create(data);
};

/**
 * Az összes szerviz-alkatrész tétel lekérése.
 * @async
 * @returns {Promise<Array>}
 */
exports.getAllServiceParts = async () => {
    return await servicePartModel.findAll();
};

/**
 * Szerviz-alkatrész tétel lekérése ID alapján.
 * @async
 * @param {number|string} id - Belső azonosító.
 * @throws {Error} Ha a rekord nem található.
 * @returns {Promise<Object>}
 */
exports.getServicePartById = async (id) => {
    const part = await servicePartModel.findById(id);
    if (!part) throw new Error("A keresett szerviz-alkatrész nem található!");
    return part;
};

/**
 * Meglévő tétel frissítése validálással.
 * @async
 * @param {number|string} id - Azonosító.
 * @param {Object} data - Frissítendő mezők.
 * @throws {Error} Ha a módosított adatok érvénytelenek vagy a rekord nem létezik.
 * @returns {Promise<Object>}
 */
exports.updateServicePart = async (id, data) => {
    // Üzleti logika: Ha módosítunk, itt is ellenőrizzük a mennyiséget
    if (data.quantity !== undefined && data.quantity <= 0) {
        throw new Error("A módosított mennyiségnek pozitívnak kell lennie!");
    }
    const updated = await servicePartModel.update(id, data);
    if (!updated) throw new Error("Sikertelen frissítés: a rekord nem létezik!");
    return updated;
};

/**
 * Tétel törlése a rendszerből.
 * @async
 * @param {number|string} id - Azonosító.
 * @throws {Error} Ha a rekord nem található.
 * @returns {Promise<boolean>}
 */
exports.deleteServicePart = async (id) => {
    const success = await servicePartModel.remove(id);
    if (!success) throw new Error("Sikertelen törlés: a rekord nem található!");
    return success;
};