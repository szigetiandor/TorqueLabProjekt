const serviceLogService = require("../services/serviceLog.service")

exports.createServiceLog = async (req, res) => {
  try {
    const { car_id, performed_by, service_date, description } = req.body;

    if (!car_id) {
      return res.status(400).json({error: "Car ID is required"})
    }

    if (!performed_by) {
      return res.status(400).json({error: "performed by is required"})
    }

    if (!service_date) {
      return res.status(400).json({error: "ServiceLog date is required"})
    }

    const service = await serviceLogService.createService({car_id, performed_by, service_date, description})

    res.status(201).json(service)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

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

exports.updateServiceLog = async (req, res) => {
  try {
    const { car_id, performed_by, service_date, description } = req.body;

    if (!car_id) {
      return res.status(400).json({error: "Car ID is required"})
    }

    if (!performed_by) {
      return res.status(400).json({error: "performed by is required"})
    }

    if (!service_date) {
      return res.status(400).json({error: "ServiceLog date is required"})
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
