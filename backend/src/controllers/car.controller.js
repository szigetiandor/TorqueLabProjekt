const carService = require("../services/car.service");

exports.createCar = async (req, res) => {
  try {
    const car = await carService.createCar(req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const { model, type } = req.query;
    const cars = await carService.getAllCars(model, type);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await carService.updateCar(req.params.id, req.body);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const deleted = await carService.deleteCar(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};