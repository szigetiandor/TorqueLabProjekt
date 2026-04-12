const serviceLogModel = require("../models/serviceLog.model")
const serviceCommentModel = require("../models/serviceComment.model")

exports.createService = async (data) => {
  return await serviceLogModel.create(data)
}

exports.getAllServices = async () => {
  return await serviceLogModel.findAll()
}

exports.getServiceById = async (id) => {
  return await serviceLogModel.findById(id)
}

exports.updateService = async (id, data) => {
  return await serviceLogModel.update(id, data)
}

exports.deleteService = async (id) => {
  return await serviceLogModel.remove(id)
}

exports.getCommentsByServiceId = async (serviceId) => {
    const comments = await serviceCommentModel.findByServiceId(serviceId);  
    return comments;
};