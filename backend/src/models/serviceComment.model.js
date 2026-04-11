const {getPool} = require('../database')

exports.create = async (comment) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('by_user', comment.by_user)
    .input('service_id', comment.service_id)
    .input('comment', comment.comment)
    .query(`INSERT INTO service_comment (by_user, service_id, comment) OUTPUT INSERTED.* VALUES (@by_user, @service_id, @comment)`)
  return result.recordset[0]
}

exports.findAll = async () => {
  const pool = await getPool()
  const result = await pool
    .request()
    .query('SELECT * FROM service_comment')
  return result.recordset
}

exports.findById = async (id) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', id)
    .query(`SELECT * FROM service_comment WHERE service_comment_id = @id`)
  return result.recordset[0] ?? null
}

exports.update = async (id, comment) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .input("by_user", comment.by_user)
    .input("comment", comment.comment)
    .query(`UPDATE service_comment SET by_user=@by_user, comment=@comment OUTPUT INSERTED.* WHERE service_comment_id=@id`);
  return result.recordset[0] ?? null
}

exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM service_comment WHERE service_comment_id=@id");
  return result.rowsAffected[0] > 0
}