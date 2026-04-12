/**
 * @module UserModel
 * @description Felhasználói adatok és hitelesítési információk adatbázis-műveleteit (DAO) kezelő modul.
 */

const { getPool } = require("../database");

/**
 * Felhasználó entitás osztály.
 * Tartalmazza a biztonsági logikát az adatok JSON-né alakításához.
 */
class User {
  /**
   * @param {Object} params - A felhasználó tulajdonságai.
   * @param {number} params.user_id - Elsődleges kulcs.
   * @param {string} params.name - Felhasználó neve.
   * @param {string} params.email - Egyedi email cím.
   * @param {string} params.password_hash - Bcrypt-tel hashelt jelszó.
   * @param {boolean} params.is_admin - Adminisztrátori jogosultság jelzője.
   */
  constructor({ user_id, name, email, password_hash, is_admin }) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.is_admin = is_admin;

    /** @private */
    this._password_hash = password_hash;
  }

  /**
   * Biztonsági metódus: JSON-né alakításkor automatikusan eltávolítja a jelszó hash-t.
   * Így az API válaszokban nem szivároghat ki érzékeny adat.
   * @returns {Object} Felhasználó adatai jelszó nélkül.
   */
  toJSON() {
    const { _password_hash, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

/**
 * Új felhasználó létrehozása az adatbázisban.
 * @async
 * @param {Object} user - Az új felhasználó adatai (név, email, hash, admin státusz).
 * @returns {Promise<User|null>} A létrehozott User objektum.
 */
exports.create = async (user) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("name", user.name)
    .input("email", user.email)
    .input("password_hash", user._password_hash)
    .input("is_admin", user.is_admin)
    .query("INSERT INTO [user] ([name], email, password_hash, is_admin) OUTPUT INSERTED.* VALUES (@name, @email, @password_hash, @is_admin)");
  
  return result.recordset[0] ? new User(result.recordset[0]) : null;
};

/**
 * Az összes felhasználó lekérése.
 * @async
 * @returns {Promise<User[]>}
 */
exports.findAll = async () => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM [user]");
  return result.recordset.map(x => new User(x));
};

/**
 * Felhasználó keresése azonosító (ID) alapján.
 * @async
 * @param {number|string} id - A felhasználó ID-ja.
 */
exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM [user] WHERE user_id = @id");
  return result.recordset[0] ? new User(result.recordset[0]) : null;
};

/**
 * Felhasználó keresése email cím alapján (bejelentkezéshez).
 * @async
 * @param {string} email - A keresett email cím.
 * @returns {Promise<User|null>}
 */
exports.findByEmail = async (email) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("email", email)
    .query("SELECT * FROM [user] WHERE email = @email");
  return result.recordset[0] ? new User(result.recordset[0]) : null;
};

/**
 * Felhasználó adatainak (név, email, jelszó, admin státusz) frissítése.
 * @async
 */
exports.update = async (id, user) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .input("name", user.name)
    .input("email", user.email)
    .input("password_hash", user._password_hash)
    .input("is_admin", user.is_admin)
    .query("UPDATE [user] SET [name] = @name, email = @email, password_hash = @password_hash, is_admin = @is_admin OUTPUT INSERTED.* WHERE user_id = @id");
  return result.recordset[0] ? new User(result.recordset[0]) : null;
};

/**
 * Felhasználó törlése az adatbázisból.
 * @async
 * @param {number|string} id - Az azonosító.
 * @returns {Promise<boolean>} True, ha a törlés sikeres volt.
 */
exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM [user] WHERE user_id = @id");
  return result.rowsAffected[0] > 0;
};

/**
 * Meglévő felhasználó előléptetése adminisztrátorrá.
 * @async
 * @param {number|string} id - A felhasználó azonosítója.
 * @returns {Promise<User|null>} A frissített User objektum.
 */
exports.makeAdmin = async (id) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", id)
    .query("UPDATE [user] SET is_admin=1 OUTPUT INSERTED.* WHERE user_id=@id");
  return result.recordset[0] ? new User(result.recordset[0]) : null;
};

exports.User = User;