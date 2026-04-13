/**
 * @module CarModel
 * @description Az autók adatstruktúráját és az adatbázis lekérdezéseket (DAO) tartalmazó modul.
 */

const { getPool } = require("../database");

/**
 * Autó entitás osztály.
 * Segít egységes formátumba hozni az adatbázisból érkező sorokat.
 */
class Car {
  /**
   * @param {Object} params - Az autó tulajdonságai.
   */
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

/**
 * Összes autó lekérése opcionális szűréssel.
 * @async
 * @param {string} [modelFilter] - Szűrés a modell nevére (LIKE).
 * @param {string} [typeFilter] - Szűrés felépítmény típusra.
 * @returns {Promise<Car[]>} Car objektumok tömbje.
 */
exports.findAll = async (modelFilter, typeFilter, forSaleFilter) => {
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
  if (forSaleFilter) {
    request.input("for_sale", forSaleFilter);
    sql += " AND for_sale = @for_sale"
  }

  const result = await request.query(sql);
  return result.recordset.map(x => new Car(x));
};

/**
 * Autó keresése egyedi azonosító alapján.
 * @async
 * @param {number|string} id - Az autó azonosítója.
 * @returns {Promise<Car|null>} Car objektum vagy null, ha nem található.
 */
exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("SELECT * FROM car WHERE car_id = @id");
  return result.recordset[0] ? new Car(result.recordset[0]) : null;
};

exports.findByVin = async (vin) => {
  const final_vin = vin.toUpperCase();
  const pool = await getPool();
  const result = await pool.request().input("vin", final_vin).query("SELECT * FROM car WHERE vin = @vin");
  return result.recordset[0] ? new Car(result.recordset[0]) : null;
};

/**
 * Új autó beszúrása az adatbázisba.
 * @async
 * @param {Object} car - Az új autó adatai.
 * @returns {Promise<Car>} A frissen létrehozott Car objektum az adatbázis által generált ID-val.
 */
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
    .input("owner_id", car.owner_id)
    .query(`INSERT INTO car (vin, brand, [model], [production_year], engine, mileage, price, [description], owner_id) 
            OUTPUT INSERTED.* VALUES (@vin, @brand, @model, @production_year, @engine, @mileage, @price, @description, @owner_id)`);
  return new Car(result.recordset[0]);
};

/**
 * Meglévő autó adatainak frissítése.
 * @async
 * @param {number|string} id - A frissítendő autó ID-ja.
 * @param {Object} car - Az új adatok.
 * @returns {Promise<Car|null>} A frissített Car objektum.
 */
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

/**
 * Autó törlése az adatbázisból.
 * @async
 * @param {number|string} id - A törlendő autó azonosítója.
 * @returns {Promise<boolean>} Igaz, ha történt törlés, egyébként hamis.
 */
exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM car WHERE car_id=@id");
  return result.rowsAffected[0] > 0;
};

exports.Car = Car;