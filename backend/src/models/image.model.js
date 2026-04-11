const { getPool } = require('../database')

exports.create = async (image) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('file_name', image.file_name)
    .input('by_user', image.by_user)
    .query('INSERT INTO [image] (file_name, by_user) OUTPUT INSERTED.* VALUES (@file_name, @by_user)')

  return result.recordset[0]
}

exports.findAll = async () => {
  const pool = await getPool()
  const result = await pool
    .request()
    .query('SELECT * FROM [image]')
  return result.recordset
}

exports.findById = async (id) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', id)
    .query('SELECT * FROM [image] WHERE image_id=@id')
  return result.recordset[0] ?? null
}

exports.update = async (id, image) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('file_name', image.file_name)
    .input('by_user', image.by_user)
    .input('id', id)
    .query('UPDATE [image] SET file_name=@file_name, by_user=@by_user, created_at=CURRENT_TIMESTAMP OUTPUT INSERTED.* WHERE image_id=@id')
  return result.recordset[0] ?? null
}

exports.remove = async (id) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM [image] WHERE image_id=@id')
  return result.rowsAffected[0] > 0
}