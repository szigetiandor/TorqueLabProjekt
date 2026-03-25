const { getPool } = require("../database");

class Part {
  constructor({part_id, name, manufacturer, part_number, price, stock_quantity, description}) {
    this.part_id = part_id
    this.name = name
    this.manufacturer = manufacturer
    this.part_number = part_number
    this.price = price
    this.stock_quantity = stock_quantity
    this.description = description
  }
}

exports.create = async (part) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input("name", part.name)
    .input("manufacturer", part.manufacturer)
    .input("part_number", part.part_number)
    .input("price", part.price)
    .input("stock_quantity", part.stock_quantity)
    .input("description", part.description)
    .query(`INSERT INTO part ([name], manufacturer, part_number, price, stock_quantity, [description]) OUTPUT INSERTED.* VALUES (@name, @manufacturer, @part_number, @price, @stock_quantity, @description)`);
  return new Part(result.recordset[0])
}

exports.findAll = async () => {
  const pool = await getPool()
  const result = await pool
    .request()
    .query("SELECT * FROM part")
  return result.recordset.map(x => new Part(x))
}

exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("SELECT * FROM part WHERE part_id = @id");
  return result.recordset[0] ? new Part(result.recordset[0]) : null
}

exports.update = async (id, part) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .input("name", part.name)
    .input("manufacturer", part.manufacturer)
    .input("part_number", part.part_number)
    .input("price", part.price)
    .input("stock_quantity", part.stock_quantity)
    .input("description", part.description)
    .query(`UPDATE part SET [name]=@name, manufacturer=@manufacturer, part_number=@part_number, price=@price, stock_quantity=@stock_quantity, [description]=@description OUTPUT INSERTED.* WHERE part_id=@id`);
  return result.recordset[0] ? new Part(result.recordset[0]) : null
}

exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM part WHERE part_id=@id");
  return result.rowsAffected[0] > 0
}

exports.Part = Part;
