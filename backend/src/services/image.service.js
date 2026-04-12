const imageModel = require('../models/image.model')

exports.createImage = async (data) => {
  return await imageModel.create(data)
}

exports.getAllImages = async () => {
  return await imageModel.findAll()
}

exports.getImageById = async (id) => {
  return await imageModel.findById(id)
}

exports.updateImage = async (id, data) => {
  return await imageModel.update(id, data)
}

exports.deleteImage = async (id) => {
  return await imageModel.remove(id)
}