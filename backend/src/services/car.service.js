const carModel = require("../models/car.model")

exports.createCar = async (data) => {
  return await carModel.create(data)
}

exports.getAllCars = async () => {
  return await carModel.findAll()
}

exports.getCarById = async (id) => {
  return await carModel.findById(id)
}

exports.updateCar = async (id, data) => {
  return await carModel.update(id, data)
}

exports.deleteCar = async (id) => {
  return await carModel.remove(id)
}