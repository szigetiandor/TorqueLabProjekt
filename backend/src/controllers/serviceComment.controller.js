/**
 * @module ServiceCommentController
 * @description Szerviznapló bejegyzésekhez tartozó megjegyzések (kommentek) kezeléséért felelős kontroller.
 */

const serviceCommentService = require('../services/serviceComment.service')

/**
 * Új megjegyzés létrehozása egy adott szerviznapló bejegyzéshez.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} req.body - A kérés törzse.
 * @param {number} req.body.service_id - A kapcsolódó szerviznapló azonosítója.
 * @param {string} req.body.comment - A megjegyzés szövege.
 * @param {Object} req.user - A hitelesített felhasználó (szerelő/admin) adatai.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} A létrehozott megjegyzés objektuma JSON formátumban.
 */
exports.createServiceComment = async (req, res) => {
  try {
    const { service_id, comment } = req.body
    
    if (!service_id || !comment) {
      return res.status(400).json({error: 'service_id and comment are required'})
    }

    const serviceComment = await serviceCommentService.createServiceComment({
      by_user: req.user.user_id,
      service_id: service_id,
      comment: comment
    })

    res.status(200).json(serviceComment)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Lekéri az összes rendszerben tárolt szervizmegjegyzést.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON lista az összes megjegyzésről.
 */
exports.getAllServiceComments = async (req, res) => {
  try {
    const serviceComments = await serviceCommentService.getAllServiceComments()
    res.status(200).json({service_comments: serviceComments})
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Egy specifikus szervizmegjegyzés lekérése azonosító alapján.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A megjegyzés egyedi azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} JSON objektum a megjegyzés adataival.
 */
exports.getServiceCommentById = async (req, res) => {
  try {
    const {id} = req.params
    const serviceComment = await serviceCommentService.getServiceCommentById(id)

    if (!serviceComment) {
      return res.status(404).json({error: 'service comment not found'})
    }

    res.status(200).json(serviceComment)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Meglévő szervizmegjegyzés szövegének frissítése.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A frissítendő megjegyzés azonosítója.
 * @param {string} req.body.comment - Az új megjegyzés szövege.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} A frissített megjegyzés objektuma.
 */
exports.updateServiceComment = async (req, res) => {
  try {
    const {comment} = req.body
    const {id} = req.params
    
    if (!comment) {
      return res.status(400).json({error: 'comment is required'})
    }

    const updatedServiceComment = await serviceCommentService.updateServiceComment(id, {
      by_user: req.user.user_id,
      comment: comment
    })

    if (!updatedServiceComment) {
      return res.status(404).json({error: 'service comment not found'})
    }

    res.status(200).json(updatedServiceComment)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

/**
 * Szervizmegjegyzés végleges törlése.
 * * @async
 * @param {Object} req - Express kérés objektum.
 * @param {string} req.params.id - A törlendő megjegyzés azonosítója.
 * @param {Object} res - Express válasz objektum.
 * @returns {Promise<void>} Sikerességet jelző JSON objektum.
 */
exports.deleteServiceComment = async (req, res) => {
  try {
    const {id} = req.params

    const deleted = await serviceCommentService.deleteServiceComment(id)

    if (!deleted) {
      return res.status(404).json({error: 'service comment not found'})
    }

    res.status(200).json({success: deleted})
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}