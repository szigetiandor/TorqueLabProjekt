const { getPool } = require("../database")

class ServiceLog {
  constructor({ service_id, car_id, performed_by, service_date, description }) {
    this.service_id = service_id;   // INT, primary key
    this.car_id = car_id;           // INT, FK to car
    this.service_date = service_date; // DATE
    this.description = description;   // VARCHAR(255)
    this.performed_by = performed_by // INT FK to user (admin)
  }
}

exports.create = async (serviceLog) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("car_id", serviceLog.car_id)
    .input("performed_by", serviceLog.performed_by)
    .input("service_date", serviceLog.service_date)
    .input("description", serviceLog.description)
    .query(`INSERT INTO service_log (car_id, performed_by, service_date, [description]) OUTPUT INSERTED.* VALUES (@car_id, @performed_by, @service_date, @description)`)
  return new ServiceLog(result.recordset[0])
}

exports.findAll = async () => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM service_log");
  return result.recordset.map(x => new ServiceLog(x))
}

exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("SELECT * FROM service_log WHERE service_id=@id");
  return result.recordset[0] ? new ServiceLog(result.recordset[0]) : null
}

exports.update = async (id, serviceLog) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .input("car_id", serviceLog.car_id)
    .input("performed_by", serviceLog.performed_by)
    .input("service_date", serviceLog.service_date)
    .input("description", serviceLog.description)
    .query(`UPDATE service_log SET car_id=@car_id, performed_by=@performed_by, service_date=@service_date, [description]=@description OUTPUT INSERTED.* WHERE service_id=@id`);
  return result.recordset[0] ? new ServiceLog(result.recordset[0]) : null
}

exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM service_log WHERE service_id=@id");
  return result.rowsAffected[0] > 0
}

exports.findByOwnerId = async (ownerId) => {
    try {
        let pool = await getPool();
        let result = await pool.request()
            .input('ownerId', ownerId)
            .query(`
                SELECT 
                    sl.*, 
                    c.brand, c.model, c.vin,
                    u_worker.name as worker_name
                FROM service_log sl
                JOIN car c ON sl.car_id = c.car_id
                LEFT JOIN [user] u_worker ON sl.performed_by = u_worker.user_id
                WHERE c.owner_id = @ownerId
                ORDER BY sl.service_date DESC
            `);
        return result.recordset;
    } catch (err) {
        throw err;
    }
}

exports.ServiceLog = ServiceLog;