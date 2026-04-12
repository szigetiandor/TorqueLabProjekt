/**
 * @module ServicePartController
 * @description Szerviznaplóhoz rendelt alkatrészek kezeléséért felelős kontroller.
 */

const servicePartService = require("../services/servicePart.service")

/**
 * Alkatrész hozzárendelése egy szerviznapló bejegyzéshez.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.body - A hozzárendelés adatai.
 * @param {number} req.body.service_id - A szerviznapló azonosítója.
 * @param {number} req.body.part_id - Az alkatrész azonosítója.
 * @param {number} req.body.quantity - Felhasznált mennyiség.
 * @param {number} req.body.unit_price - Alkalmazott egységár az adott szervizkor.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 201-es kód és a létrehozott bejegyzés JSON formátumban.
 */
exports.createServicePart = async (req, res) => {
  try {
    const { service_id, part_id, quantity, unit_price } = req.body;

    if (!service_id || !part_id || !quantity || !unit_price) {
      return res.status(400).json({error: "Minden mező (service_id, part_id, quantity, unit_price) kitöltése kötelező!"})
    }

    const service = await servicePartService.createServicePart({service_id, part_id, quantity, unit_price})

    res.status(201).json(service)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Az összes szerviz-alkatrész kapcsolat lekérése.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON lista az összes kapcsolódó alkatrészről.
 */
exports.getAllServiceParts = async (req, res) => {
  try {
    const services = await servicePartService.getAllServiceParts()
    res.json(services)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Egy konkrét szerviz-alkatrész hozzárendelés lekérése ID alapján.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A rekord egyedi azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON objektum a hozzárendelés adataival.
 */
exports.getServicePartById = async (req, res) => {
  try {
    const service = await servicePartService.getServicePartById(req.params.id)

    if (!service) {
      return res.status(404).json({error: "ServicePart not found"})
    }

    res.json(service)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Egy szerviznaplóhoz tartozó alkatrész adatainak (pl. mennyiség, ár) módosítása.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A rekord azonosítója.
 * @param {Object} req.body - A frissítendő adatok.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} A frissített rekord JSON formátumban.
 */
exports.updateServicePart = async (req, res) => {
  try {
    const { service_id, part_id, quantity, unit_price } = req.body;

    if (!service_id || !part_id || !quantity || !unit_price) {
      return res.status(400).json({error: "Minden mező kitöltése kötelező a frissítéshez!"})
    }

    const service = await servicePartService.updateServicePart(req.params.id, { service_id, part_id, quantity, unit_price })

    if (!service) {
      return res.status(404).json({error: "ServicePart not found"})
    }

    res.json(service)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Alkatrész eltávolítása egy szerviznapló bejegyzésből.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A rekord azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} A törölt rekord visszajelzése.
 */
exports.deleteServicePart = async (req, res) => {
  try {
    const deleted = await servicePartService.deleteServicePart(req.params.id)

    if (!deleted) {
      return res.status(404).json({error: "ServicePart not found"})
    }

    res.json(deleted)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}