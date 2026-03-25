const partService = require("../services/part.service")

exports.createPart = async (req, res) => {
  try {
    const {name, manufacturer, part_number, price, stock_quantity, description} = req.body

    if (!name) {
      return res.status(400).json({error: "name is required"})
    }

    if (!manufacturer) {
      return res.status(400).json({error: "manufacturer is required"})
    }

    if (!part_number) {
      return res.status(400).json({error: "part_number is required"})
    }

    if (!price) {
      return res.status(400).json({error: "price is required"})
    }

    if (!stock_quantity) {
      return res.status(400).json({error: "stock_quantity is required"})
    }

    if (!description) {
      return res.status(400).json({error: "description is required"})
    }

    const part = await partService.createPart({name, manufacturer, part_number, price, stock_quantity, description})

    res.status(201).json(part)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.getAllParts = async (req, res) => {
  try {
    const parts = await partService.getAllParts()
    res.json(parts)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.getPartById = async (req, res) => {
  try {
    const part = await partService.getPartById(req.params.id)
    if (!part) {
      return res.status(404).json({error: "Part not found"})
    }
    res.json(part)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.updatePart = async (req, res) => {
  try {
    const {name, manufacturer, part_number, price, stock_quantity, description} = req.body


    if (!name) {
      return res.status(400).json({error: "name is required"})
    }

    if (!manufacturer) {
      return res.status(400).json({error: "manufacturer is required"})
    }

    if (!part_number) {
      return res.status(400).json({error: "part_number is required"})
    }

    if (!price) {
      return res.status(400).json({error: "price is required"})
    }

    if (!stock_quantity) {
      return res.status(400).json({error: "stock_quantity is required"})
    }

    if (!description) {
      return res.status(400).json({error: "description is required"})
    }

    const part = await partService.updatePart(req.params.id, {name, manufacturer, part_number, price, stock_quantity, description})

    if (!part) {
      return res.status(404).json({error: "Part not found"})
    }

    res.json(part)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.deletePart = async (req, res) => {
  try {
    const part = await partService.deletePart(req.params.id)
    if (!part) {
      return res.status(404).json({error: "Part not found"})
    }
    res.json(part)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}