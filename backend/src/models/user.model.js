const { getPool } = require("../database");

class User {
  constructor({ user_id, name, email, password_hash, is_admin }) {
    this.user_id = user_id;       // INT, primary key
    this.name = name;               // VARCHAR(100), not null
    this.email = email
    this.is_admin = is_admin

    this._password_hash = password_hash
  }

  toJSON() {
    const { _password_hash, ...userWithoutPassword } = this
    return userWithoutPassword
  }
}

exports.create = async (user) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input("name", user.name)
    .input("email", user.email)
    .input("password_hash", user._password_hash)
    .input("is_admin", user.is_admin)
    .query("INSERT INTO [user] ([name], email, password_hash, is_admin) OUTPUT INSERTED.* VALUES (@name, @email, @password_hash, @is_admin)")
  const userCreated = result.recordset[0] ? new User(result.recordset[0]) : null
  //console.log(userCreated)
  return userCreated
}

exports.findAll = async () => {
  const pool = await getPool()
  const result = await pool
    .request()
    .query("SELECT * FROM [user]")
  return result.recordset.map(x => new User(x))
}

exports.findById = async (id) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM [user] WHERE user_id = @id")
  return result.recordset[0] ? new User(result.recordset[0]) : null
}

exports.findByEmail = async (email) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input("email", email)
    .query("SELECT * FROM [user] WHERE email = @email")
  return result.recordset[0] ? new User(result.recordset[0]) : null
}

exports.update = async (id, user) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input("id", id)
    .input("name", user.name)
    .input("email", user.email)
    .input("password_hash", user._password_hash)
    .input("is_admin", user.is_admin)
    .query("UPDATE [user] SET [name] = @name, email = @email, password_hash = @password_hash, is_admin = @is_admin OUTPUT INSERTED.* WHERE user_id = @id")
  return result.recordset[0] ? new User(result.recordset[0]) : null
}

exports.remove = async (id) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input("id", id)
    .query("DELETE FROM [user] WHERE user_id = @id")
  return result.rowsAffected[0] > 0
}

exports.makeAdmin = async (id) => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input("id", id)
    .query("UPDATE [user] SET is_admin=1 OUTPUT INSERTED.* WHERE user_id=@id")
  return result.recordset[0] ? new User(result.recordset[0]) : null
}

exports.User = User