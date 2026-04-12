const imageService = require('../services/image.service')
const path = require('path')

exports.getFile = async (req, res) => {
  try {
    const { name } = req.params
    const filePath = path.join(__dirname, '../../public/images', name)

    res.sendFile(filePath, (err) => {
      if (err) {
        return res.status(404).json({error: 'file not found'})
      }
    })
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}

exports.createImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: 'image file is required (allowed types: jpg, jpeg, png, webp)'})
    }

    const savedImage = await imageService.createImage({
      file_name: req.file.filename,
      by_user: req.user.user_id
    })

    res.status(201).json(savedImage)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}

exports.getAllImages = async (req, res) => {
  try {
    const images = await imageService.getAllImages()
    res.status(200).json(images)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}

exports.getImageById = async (req, res) => {
  try {
    const {id} = req.params
    const image = await imageService.getImageById(id)
    if (!image) {
      return res.status(404).json({error: 'image not found'})
    }
    res.status(200).json(image)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}

exports.updateImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: 'image file is required (allowed types: jpg, jpeg, png, webp)'})
    }
    
    const { id } = req.params 
    const image = await imageService.getImageById(id)
    if (!image) {
      return res.status(404).json({error: 'image not found'})
    }
    const { by_user, ...rest } = image
    if (by_user !== req.user.user_id && !req.user.is_admin) {
      return res.status(401).json({error: 'unauthorized'})
    }
    const updatedImage = await imageService.updateImage(id, {
      file_name: req.file.filename,
      by_user: req.user.user_id
    })

    res.status(201).json(updatedImage)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params
    const image = await imageService.getImageById(id)

    if (!image) {
      return res.status(404).json({error: 'image not found'})
    }

    const { by_user, ...rest } = image

    if (by_user !== req.user.user_id && !req.user.is_admin) {
      return res.status(401).json({error: 'unauthorized'})
    }

    const filePath = path.join(__dirname, '../../public/images', image.file_name);
    console.log(filePath)
    
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`File ${image.file_name} not found on disk, but deleting DB record.`);
    }
    const deleted = await imageService.deleteImage(id)
    res.status(200).json(deleted)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
}
