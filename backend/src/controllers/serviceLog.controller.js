/**
 * @module ServiceLogController
 * @description Szerviznapló bejegyzések kezeléséért felelős kontroller (Munkalapok, javítási előzmények).
 */

const serviceLogService = require("../services/serviceLog.service")

/**
 * Új szerviznapló bejegyzést hoz létre.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.body - A munkalap adatai.
 * @param {number} req.body.car_id - A szervizelt autó azonosítója.
 * @param {string} req.body.service_date - A szervizelés dátuma.
 * @param {string} req.body.description - Az elvégzett munka leírása.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} 201-es kód és a létrehozott szervizbejegyzés JSON formátumban.
 */
exports.createServiceLog = async (req, res) => {
  try {
    const { car_id, performed_by, service_date, description } = req.body;

    if (!car_id) {
      return res.status(400).json({error: "Car ID is required"})
    }

    if (!service_date) {
      return res.status(400).json({error: "ServiceLog date is required"})
    }

    // Alapértelmezetten az 1-es ID-jú adminisztrátort rendeljük hozzá, ha nincs megadva
    const service = await serviceLogService.createService({car_id, performed_by: 1, service_date, description})

    res.status(201).json(service)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Lekéri egy adott szerviznaplóhoz tartozó összes megjegyzést.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A szerviznapló azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON lista a megjegyzésekről.
 */
exports.getServiceComments = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Service ID is required" });
        }

        const comments = await serviceLogService.getCommentsByServiceId(id);
        res.status(200).json(comments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Az összes szerviznapló lekérése (Admin funkció).
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON lista az összes bejegyzésről.
 */
exports.getAllServiceLogs = async (req, res) => {
  try {
    const services = await serviceLogService.getAllServices()
    res.json(services)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Egy konkrét szerviznapló lekérése ID alapján.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A bejegyzés azonosítója.
 * @param {Object} res - Express válasz objektum.
 */
exports.getServiceLogById = async (req, res) => {
  try {
    const service = await serviceLogService.getServiceById(req.params.id)

    if (!service) {
      return res.status(404).json({error: "ServiceLog not found"})
    }

    res.json(service)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Meglévő szerviznapló adatainak módosítása.
 * * @async
 */
exports.updateServiceLog = async (req, res) => {
  try {
    const { car_id, performed_by, service_date, description } = req.body;

    if (!car_id || !performed_by || !service_date) {
      return res.status(400).json({error: "Missing required fields"})
    }

    const service = await serviceLogService.updateService(req.params.id, { car_id, performed_by, service_date, description })

    if (!service) {
      return res.status(404).json({error: "ServiceLog not found"})
    }

    res.json(service)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Szerviznapló bejegyzés törlése.
 * * @async
 */
exports.deleteServiceLog = async (req, res) => {
  try {
    const deleted = await serviceLogService.deleteService(req.params.id)

    if (!deleted) {
      return res.status(404).json({error: "ServiceLog not found"})
    }

    res.json(deleted)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * A bejelentkezett felhasználó saját gépjárműveihez tartozó szerviznaplók lekérése.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.user - A hitelesített felhasználó (a tokenből).
 * @returns {Promise<void>} JSON lista a felhasználó saját szervizmúltjáról.
 */
exports.getMyServiceLogs = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const logs = await serviceLogService.getLogsByOwner(userId);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};