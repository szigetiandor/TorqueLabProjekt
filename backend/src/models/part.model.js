/**
 * @module PartModel
 * @description Alkatrészek adatstruktúráját és raktárkészlet-műveleteit (DAO) tartalmazó modul.
 */

const { getPool } = require("../database");

/**
 * Alkatrész entitás osztály.
 * Strukturált formátumban tárolja a raktári tételek adatait.
 */
class Part {
  /**
   * @param {Object} params - Az alkatrész tulajdonságai.
   */
  constructor({part_id, name, manufacturer, part_number, price, stock_quantity, description, category, image_filename}) {
    this.part_id = part_id;
    this.name = name;
    this.manufacturer = manufacturer;
    this.part_number = part_number;
    this.price = price;
    this.stock_quantity = stock_quantity;
    this.description = description;
    this.category = category;
    this.image_filename = image_filename
  }
}

/**
 * Alkatrészek keresése és listázása dinamikus szűréssel.
 * @async
 * @param {string} [searchQuery] - Keresési kulcsszó (név, gyártó vagy leírás alapján).
 * @param {number} [maxPrice] - Maximális eladási ár szerinti korlátozás.
 * @returns {Promise<Part[]>} A keresési feltételeknek megfelelő Part objektumok tömbje.
 */
exports.findAll = async (searchQuery, maxPrice, category) => {
  const pool = await getPool();
  const request = pool.request();
  
  // Alap lekérdezés: minden terméket kérünk (1=1 a dinamikus AND fűzéshez)
  let sql = "SELECT * FROM part WHERE 1=1";

  
  if (searchQuery && searchQuery !== 'all' && searchQuery !== '') {
    
    const cleanQuery = searchQuery.replace(/-/g, ' ');
    request.input("search", `%${cleanQuery}%`);
    sql += " AND ([name] LIKE @search OR manufacturer LIKE @search OR [description] LIKE @search)";
  }

  
  if (maxPrice) {
    request.input("maxPrice", maxPrice);
    sql += " AND price <= @maxPrice";
  }

  
  if (category && category !== 'all') { 
      request.input("category", category);
      sql += " AND category = @category";
    }

  const result = await request.query(sql);
  return result.recordset.map(x => new Part(x));
}

/**
 * Új alkatrész rögzítése az adatbázisba.
 * @async
 * @param {Object} part - Az új alkatrész adatai.
 * @returns {Promise<Part>} A létrehozott alkatrész objektuma.
 */
exports.create = async (part) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("name", part.name)
    .input("manufacturer", part.manufacturer)
    .input("part_number", part.part_number)
    .input("price", part.price)
    .input("stock_quantity", part.stock_quantity)
    .input("description", part.description)
    .input("category", part.category)
    .query(`INSERT INTO part ([name], manufacturer, part_number, price, stock_quantity, [description], category) 
            OUTPUT INSERTED.* VALUES (@name, @manufacturer, @part_number, @price, @stock_quantity, @description, @category)`);
  return new Part(result.recordset[0]);
}

/**
 * Egy alkatrész lekérése ID alapján.
 * @async
 * @param {number|string} id - Az alkatrész azonosítója.
 * @returns {Promise<Part|null>} A megtalált alkatrész vagy null.
 */
exports.findById = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("SELECT * FROM part WHERE part_id = @id");
  return result.recordset[0] ? new Part(result.recordset[0]) : null;
}

/**
 * Meglévő alkatrész adatainak (pl. ár vagy raktárkészlet) módosítása.
 * @async
 */
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
    .input("category", part.category)
    .query(`UPDATE part SET [name]=@name, manufacturer=@manufacturer, part_number=@part_number, 
            price=@price, stock_quantity=@stock_quantity, [description]=@description, category=@category
            OUTPUT INSERTED.* WHERE part_id=@id`);
  return result.recordset[0] ? new Part(result.recordset[0]) : null;
}

/**
 * Alkatrész törlése az adatbázisból.
 * @async
 * @param {number|string} id - Az alkatrész azonosítója.
 * @returns {Promise<boolean>} Igaz, ha a törlés sikeres volt.
 */
exports.remove = async (id) => {
  const pool = await getPool();
  const result = await pool.request().input("id", id).query("DELETE FROM part WHERE part_id=@id");
  return result.rowsAffected[0] > 0;
}

exports.Part = Part;