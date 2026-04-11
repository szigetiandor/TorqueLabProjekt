const partService = require("../services/part.service")

exports.getAllParts = async (req, res) => {
  try {
    // Kiolvassuk a ?query= valami &price= szám értékeket az URL-ből
    const { query, price } = req.query;
    
    // Lekérjük a szűrt listát
    const parts = await partService.getAllParts(query, price);
    res.json(parts);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({error: err.message});
  }
}

exports.createPart = async (req, res) => {
  try {
    const {name, manufacturer, part_number, price, stock_quantity, description} = req.body
    if (!name || !manufacturer || !part_number || !price || !stock_quantity || !description) {
      return res.status(400).json({error: "Minden mező kitöltése kötelező!"})
    }
    const part = await partService.createPart({name, manufacturer, part_number, price, stock_quantity, description})
    res.status(201).json(part)
  }
  catch (err) {
    console.log(err);
    res.status(500).json({error: err.message});
  }
}

exports.getPartById = async (req, res) => {
  try {
    const part = await partService.getPartById(req.params.id)
    if (!part) return res.status(404).json({error: "Alkatrész nem található"});
    res.json(part)
  }
  catch (err) {
    res.status(500).json({error: err.message})
  }
}

exports.updatePart = async (req, res) => {
  try {
    const part = await partService.updatePart(req.params.id, req.body)
    if (!part) return res.status(404).json({error: "Sikertelen frissítés"});
    res.json(part)
  }
  catch (err) {
    res.status(500).json({error: err.message})
  }
}

exports.deletePart = async (req, res) => {
  try {
    const success = await partService.deletePart(req.params.id)
    if (!success) return res.status(404).json({error: "Sikertelen törlés"});
    res.json({ message: "Sikeres törlés" })
  }
  catch (err) {
    res.status(500).json({error: err.message})
  }
}