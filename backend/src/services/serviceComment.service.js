const serviceCommentModel = require('../models/serviceComment.model')

exports.createServiceComment = async (data) => {
  return await serviceCommentModel.create(data)
}

exports.getAllServiceComments = async () => {
  return await serviceCommentModel.findAll()
}

exports.getServiceCommentById = async (id) => {
  return await serviceCommentModel.findById(id)
}

exports.updateServiceComment = async (id, data) => {
  return await serviceCommentModel.update(id, data)
}

exports.deleteServiceComment  = async (id) => {
  return await serviceCommentModel.remove(id)
}
