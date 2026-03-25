const servicePartModel = require("../models/servicePart.model")

exports.createServicePart = async (data) => {
  return await servicePartModel.create(data)
}

exports.getAllServiceParts = async () => {
  return await servicePartModel.findAll()
}

exports.getServicePartById = async (id) => {
  return await servicePartModel.findById(id)
}

exports.updateServicePart = async (id, data) => {
  return await servicePartModel.update(id, data)
}

exports.deleteServicePart = async (id) => {
  return await servicePartModel.remove(id)
}