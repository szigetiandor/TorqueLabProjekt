const { getPool } = require("../database");

class Car {
  constructor({ car_id, vin, brand, model, production_year, engine, mileage, price, imageUrl, description, build_type, owner_id }) {
    this.car_id = car_id;
    this.vin = vin;
    this.brand = brand;
    this.model = model;
    this.production_year = production_year;
    this.engine = engine;
    this.mileage = mileage;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.build_type = build_type;
    this.owner_id = owner_id;
  }
}

exports.findAll = async (modelFilter, typeFilter) => {
  const pool = await getPool();
  const request = pool.request();
  let sql = "SELECT * FROM car WHERE 1=1";

  if (modelFilter) {
    request.input("model", `%${modelFilter}%`);
    sql += " AND model LIKE @model";
  }
  if (typeFilter) {
    request.input("type", typeFilter);
    sql += " AND build_type = @type";
  }

  const result = await request.query(sql);
  return result.recordset.map(x => new Car(x));
};

exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("SELECT * FROM car WHERE car_id = @id");
  return result.recordset[0] ? new Car(result.recordset[0]) : null;
};

exports.create = async (car) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("vin", car.vin)
    .input("brand", car.brand)
    .input("model", car.model)
    .input("production_year", car.production_year)
    .input("engine", car.engine)
    .input("mileage", car.mileage)
    .input("price", car.price)
    .input("imageUrl", car.imageUrl)
    .input("description", car.description)
    // .input("build_type", car.build_type)
    .input("owner_id", car.owner_id)
    .query(`INSERT INTO car (vin, brand, [model], [production_year], engine, mileage, price, [description], owner_id) 
            OUTPUT INSERTED.* VALUES (@vin, @brand, @model, @production_year, @engine, @mileage, @price, @description, @owner_id)`);
  return new Car(result.recordset[0]);
};

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
    .input("price", car.price)
    .input("imageUrl", car.imageUrl)
    .input("description", car.description)
    .input("build_type", car.build_type)
    .input("owner_id", car.owner_id)
    .query(`UPDATE car SET vin=@vin, brand=@brand, [model]=@model, [production_year]=@production_year, engine=@engine, 
            mileage=@mileage, price=@price, imageUrl=@imageUrl, [description]=@description, build_type=@build_type, owner_id=@owner_id 
            OUTPUT INSERTED.* WHERE car_id=@id`);
  return result.recordset[0] ? new Car(result.recordset[0]) : null;
};

exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM car WHERE car_id=@id");
  return result.rowsAffected[0] > 0;
};

exports.Car = Car;