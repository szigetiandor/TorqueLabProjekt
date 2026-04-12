const carService = require("../services/car.service");

exports.createCar = async (req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ error: "Nem azonosítható felhasználó!" });
        }

        const carData = {
            vin: req.body.vin,
            brand: req.body.brand,
            model: req.body.model,
            production_year: req.body.production_year,
            engine: req.body.engine,
            mileage: req.body.mileage,
            for_sale: req.body.for_sale || 0,
            price: req.body.price || 0,

            owner_id: req.user.user_id
        };

        const car = await carService.createCar(carData);
        res.status(201).json(car);
    } catch (err) {
        console.error("Hiba az autó mentésekor:", err.message);
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