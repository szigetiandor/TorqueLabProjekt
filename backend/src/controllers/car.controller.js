const carService = require("../services/car.service")

exports.createCar = async (req, res) => {
  try {
    const {vin, brand, model, production_year, engine, mileage, owner_id} = req.body

    if (!vin) {
      return res.status(400).json({error: "VIN is required"})
    }

    if (!brand) {
      return res.status(400).json({error: "brand is required"})
    }

    if (!model) {
      return res.status(400).json({error: "Model is required"})
    }

    if (!engine) {
      return res.status(400).json({error: "engine is required"})
    }

    if (!production_year) {
      return res.status(400).json({error: "production_year is required"})
    }

    if (!owner_id) {
      return res.status(400).json({error: "Owner ID is required"})
    }

    if (!mileage) {
      return res.status(400).json({error: "Mileage is required"})
    }

    const car = await carService.createCar({vin, brand, model, production_year, engine, mileage, owner_id})

    res.status(201).json(car)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.getAllCars = async (req, res) => {
  try {
    const cars = await carService.getAllCars()
    res.json(cars)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id)
    if (!car) {
      return res.status(404).json({error: "Car not found"})
    }
    res.json(car)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.updateCar = async (req, res) => {
  try {
    const {vin, brand, model, production_year, engine, mileage, owner_id} = req.body

    if (!vin) {
      return res.status(400).json({error: "VIN is required"})
    }

    if (!brand) {
      return res.status(400).json({error: "brand is required"})
    }

    if (!model) {
      return res.status(400).json({error: "Model is required"})
    }

    if (!engine) {
      return res.status(400).json({error: "engine is required"})
    }

    if (!production_year) {
      return res.status(400).json({error: "production_year is required"})
    }

    if (!owner_id) {
      return res.status(400).json({error: "Owner ID is required"})
    }

    if (!mileage) {
      return res.status(400).json({error: "Mileage is required"})
    }

    const car = await carService.updateCar(req.params.id, {vin, brand, model, production_year, engine, mileage, owner_id})

    if (!car) {
      return res.status(404).json({error: "Car not found"})
    }

    res.json(car)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.deleteCar = async (req, res) => {
  try {
    const car = await carService.deleteCar(req.params.id)
    if (!car) {
      return res.status(404).json({error: "Car not found"})
    }
    res.json(car)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}