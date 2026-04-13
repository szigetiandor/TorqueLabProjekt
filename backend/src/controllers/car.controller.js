/**
 * @module CarController
 * @description Gépjárművek kezeléséért felelős kontroller. 
 * Implementálja a CRUD műveleteket és biztosítja a tulajdonosi szintű hozzáférés-szabályozást.
 */

const carService = require("../services/car.service");

/**
 * Belső segédfüggvény a jogosultság ellenőrzéséhez.
 * @function hasCarAccess
 * @private
 * @param {Object} user - A hitelesített felhasználó objektuma (req.user).
 * @param {number|string} user.user_id - A felhasználó azonosítója.
 * @param {boolean} user.is_admin - Adminisztrátori státusz.
 * @param {Object} car - Az adatbázisból lekérdezett autó objektum.
 * @param {number|string} car.owner_id - Az autó tulajdonosának azonosítója.
 * @returns {boolean} Igaz, ha a művelet engedélyezett.
 */
const hasCarAccess = (user, car) => {
    return user.is_admin || String(user.user_id) === String(car.owner_id);
};

/**
 * Új gépjármű létrehozása.
 * A metódus automatikusan hozzárendeli a bejelentkezett felhasználót tulajdonosként.
 * * @async
 * @function createCar
 * @param {Object} req - Express request objektum.
 * @param {Object} req.user - Auth middleware által feltöltött felhasználói adatok.
 * @param {Object} req.body - Gépjármű adatai (vin, brand, model, production_year stb.).
 * @param {Object} res - Express response objektum.
 * @returns {Promise<void>} 201-es státusz és a létrehozott autó, vagy hibaüzenet.
 */
exports.createCar = async (req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ error: "Nem azonosítható felhasználó! Kérjük, jelentkezzen be." });
        }

        const carData = {
            vin: req.body.vin,
            brand: req.body.brand,
            model: req.body.model,
            production_year: req.body.production_year,
            engine: req.body.engine,
            mileage: req.body.mileage,
            for_sale: req.body.for_sale || 0,
            price: req.body.price || 0,
            owner_id: req.user.user_id 
        };

        const car = await carService.createCar(carData);
        res.status(201).json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Az összes gépjármű listázása szűrési lehetőséggel.
 * * @async
 * @function getAllCars
 * @param {Object} req - Express request objektum.
 * @param {Object} req.query - Query paraméterek.
 * @param {string} [req.query.model] - Szűrés modell alapján.
 * @param {string} [req.query.type] - Szűrés típus alapján.
 * @param {Object} res - Express response objektum.
 * @returns {Promise<void>} JSON lista az autókról.
 */
exports.getAllCars = async (req, res) => {
  try {
    const { model, type, for_sale } = req.query;
    const cars = await carService.getAllCars(model, type, for_sale);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Egy gépjármű adatainak lekérése azonosító alapján.
 * * @async
 * @function getCarById
 * @param {Object} req - Express request objektum.
 * @param {string} req.params.id - Az autó azonosítója az URL-ből.
 * @param {Object} res - Express response objektum.
 * @returns {Promise<void>} Az autó adatai vagy 404-es hiba.
 */
exports.getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) return res.status(404).json({ error: "Gépjármű nem található." });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCarByVin = async (req, res) => {
  try {
    const car = await carService.getCarByVin(req.params.vin);
    if (!car) return res.status(404).json({ error: "Gépjármű nem található." });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Gépjármű adatainak frissítése.
 * Csak az autó tulajdonosa vagy adminisztrátor hajthatja végre.
 * * @async
 * @function updateCar
 * @param {Object} req - Express request objektum.
 * @param {string} req.params.id - Az autó azonosítója.
 * @param {Object} req.body - A frissítendő mezők.
 * @param {Object} res - Express response objektum.
 * @returns {Promise<void>} A frissített objektum vagy 403-as hiba jogosultság hiányában.
 */
exports.updateCar = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) return res.status(404).json({ error: "Gépjármű nem található." });

    if (!hasCarAccess(req.user, car)) {
        return res.status(403).json({ error: "Hozzáférés megtagadva! Csak a saját autóidat módosíthatod." });
    }

    const updatedCar = await carService.updateCar(req.params.id, req.body);
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Gépjármű törlése a rendszerből.
 * Csak az autó tulajdonosa vagy adminisztrátor hajthatja végre.
 * * @async
 * @function deleteCar
 * @param {Object} req - Express request objektum.
 * @param {string} req.params.id - Az autó azonosítója.
 * @param {Object} res - Express response objektum.
 * @returns {Promise<void>} Sikerüzenet vagy hibaüzenet.
 */
exports.deleteCar = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) return res.status(404).json({ error: "Gépjármű nem található." });

    if (!hasCarAccess(req.user, car)) {
        return res.status(403).json({ error: "Hozzáférés megtagadva! Csak a saját autóidat törölheted." });
    }

    await carService.deleteCar(req.params.id);
    res.json({ message: "Gépjármű sikeresen törölve." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};