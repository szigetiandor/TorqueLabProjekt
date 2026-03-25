const { getPool } = require("../database");

class Car {
  constructor({ car_id, vin, brand, model, production_year, engine, mileage, owner_id }) {
    this.car_id = car_id;   // INT, primary key
    this.vin = vin;         // VARCHAR(17), unique
    this.brand = brand
    this.model = model;     // VARCHAR(50)
    this.production_year = production_year;       // INT
    this.engine = engine;
    this.mileage = mileage; // INT
    this.owner_id = owner_id; // INT, FK to owner
  }
}

exports.create = async (car) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input("vin", car.vin)
    .input("brand", car.brand)
    .input("model", car.model)
    .input("production_year", car.production_year)
    .input("engine", car.engine)
    .input("mileage", car.mileage)
    .input("owner_id", car.owner_id)
    .query(`INSERT INTO car (vin, brand, [model], [production_year], engine, mileage, owner_id) OUTPUT INSERTED.* VALUES (@vin, @brand, @model, @production_year, @engine, @mileage, @owner_id)`);
  return new Car(result.recordset[0])
}

exports.findAll = async () => {
  const pool = await getPool()
  const result = await pool
    .request()
    .query("SELECT * FROM car")
  return result.recordset.map(x => new Car(x))
}

exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("SELECT * FROM car WHERE car_id = @id");
  return result.recordset[0] ? new Car(result.recordset[0]) : null
}

exports.update = async (id, car) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .input("vin", car.vin)
    .input("brand", car.brand)
    .input("model", car.model)
    .input("production_year", car.production_year)
    .input("engine", car.engine)
    .input("mileage", car.mileage)
    .input("owner_id", car.owner_id)
    .query(`UPDATE car SET vin=@vin, brand=@brand, [model]=@model, [production_year]=@production_year, engine=@engine, owner_id=@owner_id, mileage=@mileage OUTPUT INSERTED.* WHERE car_id=@id`);
  return result.recordset[0] ? new Car(result.recordset[0]) : null
}

exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM car WHERE car_id=@id");
  return result.rowsAffected[0] > 0
}

exports.Car = Car;