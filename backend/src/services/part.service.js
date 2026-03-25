const partModel = require("../models/part.model")

exports.createPart = async (data) => {
  return await partModel.create(data)
}

exports.getAllParts = async () => {
  return await partModel.findAll()
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