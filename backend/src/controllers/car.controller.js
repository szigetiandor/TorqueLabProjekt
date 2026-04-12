/**
 * @module CarController
 * @description Gépjárművek kezeléséért felelős kontroller (Létrehozás, Lekérdezés, Frissítés, Törlés).
 */

const carService = require("../services/car.service");

/**
 * Új gépjárművet hoz létre az adatbázisban a bejelentkezett felhasználóhoz társítva.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.user - A hitelesített felhasználó adatai (auth middleware-ből).
 * @param {number} req.user.user_id - A bejelentkezett tulajdonos azonosítója.
 * @param {Object} req.body - Az autó adatai (vin, brand, model, production_year stb.).
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 201-es státuszkód és a létrehozott autó objektuma JSON formátumban.
 */
exports.createCar = async (req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ error: "Nem azonosítható felhasználó!" });
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
        console.error("Hiba az autó mentésekor:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Lekéri az összes gépjárművet a rendszerből, opcionális szűrési feltételekkel.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.query - Query paraméterek a szűréshez (pl. model, type).
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON lista a járművekről.
 */
exports.getAllCars = async (req, res) => {
  try {
    const { model, type } = req.query;
    const cars = await carService.getAllCars(model, type);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Egy specifikus gépjármű lekérése azonosító alapján.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - Az autó egyedi azonosítója (ID).
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON objektum az autó adataival vagy 404 hiba.
 */
exports.getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Meglévő gépjármű adatainak módosítása.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - Az autó azonosítója.
 * @param {Object} req.body - A frissítendő adatok.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} A frissített autó objektuma JSON-ben.
 */
exports.updateCar = async (req, res) => {
  try {
    const car = await carService.updateCar(req.params.id, req.body);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Gépjármű törlése a rendszerből.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - Az autó azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} Sikerüzenet JSON formátumban.
 */
exports.deleteCar = async (req, res) => {
  try {
    const deleted = await carService.deleteCar(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};