const { getPool } = require("../database");

class ServicePart {
  constructor({service_id, part_id, quantity, unit_price}) {
    this.service_id = service_id
    this.part_id = part_id
    this.quantity = quantity
    this.unit_price = unit_price
  }
}

exports.create = async (servicePart) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("service_id", servicePart.service_id)
    .input("part_id", servicePart.part_id)
    .input("quantity", servicePart.quantity)
    .input("unit_price", servicePart.unit_price)
    .query(`INSERT INTO service_part (service_id, part_id, quantity, unit_price) OUTPUT INSERTED.* VALUES (@service_id, @part_id, @quantity, @unit_price)`)
  return new ServicePart(result.recordset[0])
}

exports.findAll = async () => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM service_part");
  return result.recordset.map(x => new ServicePart(x))
}

exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("SELECT * FROM service_part WHERE service_part_id=@id");
  return result.recordset[0] ? new ServicePart(result.recordset[0]) : null
}

exports.update = async (id, servicePart) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .input("service_id", servicePart.service_id)
    .input("part_id", servicePart.part_id)
    .input("quantity", servicePart.quantity)
    .input("unit_price", servicePart.unit_price)
    .query(`UPDATE service_part SET service_id=@service_id, part_id=@part_id, quantity=@quantity, unit_price=@unit_price OUTPUT INSERTED.* WHERE service_part_id=@id`);
  return result.recordset[0] ? new ServicePart(result.recordset[0]) : null
}

exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM service_part WHERE service_part_id=@id");
  return result.rowsAffected[0] > 0
}

exports.ServicePart = ServicePart;