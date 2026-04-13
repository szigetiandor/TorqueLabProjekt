/**
 * @module PartController
 * @description Alkatrészek és raktárkészlet kezeléséért felelős kontroller.
 */

const partService = require("../services/part.service")

/**
 * Lekéri az összes alkatrészt az adatbázisból, opcionális szűréssel névre és árra.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.query - Query paraméterek.
 * @param {string} [req.query.query] - Keresési feltétel (név vagy alkatrészszám).
 * @param {number} [req.query.price] - Maximum ár szerinti szűrés.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON lista az alkatrészekről.
 */
exports.getAllParts = async (req, res) => {
  try {
    const { query, price, category } = req.query;
    const parts = await partService.getAllParts(query, price, category);
    res.json(parts);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({error: err.message});
  }
}

/**
 * Új alkatrész rögzítése a raktárkészletbe.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.body - Az alkatrész adatai.
 * @param {string} req.body.name - Az alkatrész neve.
 * @param {string} req.body.manufacturer - Gyártó.
 * @param {string} req.body.part_number - Egyedi cikkszám.
 * @param {number} req.body.price - Egységár.
 * @param {number} req.body.stock_quantity - Raktáron lévő mennyiség.
 * @param {string} req.body.description - Rövid leírás.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 201-es kód és a létrehozott alkatrész objektuma.
 */
exports.createPart = async (req, res) => {
  try {
    const {name, manufacturer, part_number, price, stock_quantity, description} = req.body
    if (!name || !manufacturer || !part_number || !price || !stock_quantity || !description) {
      return res.status(400).json({error: "Minden mező kitöltése kötelező!"})
    }
    const part = await partService.createPart({name, manufacturer, part_number, price, stock_quantity, description})
    res.status(201).json(part)
  }
  catch (err) {
    console.log(err);
    res.status(500).json({error: err.message});
  }
}

/**
 * Specifikus alkatrész lekérése azonosító alapján.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - Az alkatrész egyedi azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON objektum az alkatrész adataival.
 */
exports.getPartById = async (req, res) => {
  try {
    const part = await partService.getPartById(req.params.id)
    if (!part) return res.status(404).json({error: "Alkatrész nem található"});
    res.json(part)
  }
  catch (err) {
    res.status(500).json({error: err.message})
  }
}

/**
 * Meglévő alkatrész adatainak vagy készletmennyiségének frissítése.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - Az alkatrész azonosítója.
 * @param {Object} req.body - A frissítendő mezők.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} A frissített alkatrész objektuma.
 */
exports.updatePart = async (req, res) => {
  try {
    const part = await partService.updatePart(req.params.id, req.body)
    if (!part) return res.status(404).json({error: "Sikertelen frissítés"});
    res.json(part)
  }
  catch (err) {
    res.status(500).json({error: err.message})
  }
}

/**
 * Alkatrész törlése a rendszerből.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - Az alkatrész azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} Sikerüzenet vagy hibaüzenet.
 */
exports.deletePart = async (req, res) => {
  try {
    const success = await partService.deletePart(req.params.id)
    if (!success) return res.status(404).json({error: "Sikertelen törlés"});
    res.json({ message: "Sikeres törlés" })
  }
  catch (err) {
    res.status(500).json({error: err.message})
  }
}