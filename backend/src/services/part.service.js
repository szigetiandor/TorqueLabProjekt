const partModel = require("../models/part.model")

exports.createPart = async (data) => {
  return await partModel.create(data)
}

// Átvesszük a szűrőket és adjuk tovább a modelnek
exports.getAllParts = async (query, price) => {
  return await partModel.findAll(query, price)
}

exports.getPartById = async (id) => {
  return await partModel.findById(id)
}

exports.updatePart = async (id, data) => {
  return await partModel.update(id, data)
}

exports.deletePart = async (id) => {
  return await partModel.remove(id)
}