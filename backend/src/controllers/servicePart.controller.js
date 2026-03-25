const servicePartService = require("../services/servicePart.service")

exports.createServicePart = async (req, res) => {
  try {
    const { service_id, part_id, quantity, unit_price } = req.body;

    if (!service_id) {
      return res.status(400).json({error: "service_id is required"})
    }

    if (!part_id) {
      return res.status(400).json({error: "part_id is required"})
    }

    if (!quantity) {
      return res.status(400).json({error: "quantity is required"})
    }
    
    if (!unit_price) {
      return res.status(400).json({error: "unit_price is required"})
    }

    const service = await servicePartService.createServicePart({service_id, part_id, quantity, unit_price})

    res.status(201).json(service)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

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

exports.updateServicePart = async (req, res) => {
  try {
    const { service_id, part_id, quantity, unit_price } = req.body;

    if (!service_id) {
      return res.status(400).json({error: "service_id is required"})
    }

    if (!part_id) {
      return res.status(400).json({error: "part_id is required"})
    }

    if (!quantity) {
      return res.status(400).json({error: "quantity is required"})
    }
    
    if (!unit_price) {
      return res.status(400).json({error: "unit_price is required"})
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

