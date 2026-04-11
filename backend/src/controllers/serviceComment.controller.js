const serviceCommentService = require('../services/serviceComment.service')

exports.createServiceComment = async (req, res) => {
  try {
    const { service_id, comment } = req.body
    
    if (!service_id || !comment) {
      return res.status(400).json({error: 'service_id and comment are required'})
    }

    const serviceComment = await serviceCommentService.createServiceComment({
      by_user: req.user.user_id,
      service_id: service_id,
      comment: comment
    })

    res.status(200).json(serviceComment)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.getAllServiceComments = async (req, res) => {
  try {
    const serviceComments = await serviceCommentService.getAllServiceComments()
    res.status(200).json({service_comments: serviceComments})
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.getServiceCommentById = async (req, res) => {
  try {
    const {id} = req.params
    const serviceComment = await serviceCommentService.getServiceCommentById(id)

    if (!serviceComment) {
      return res.status(404).json({error: 'service comment not found'})
    }

    res.status(200).json(serviceComment)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.updateServiceComment = async (req, res) => {
  try {
    const {comment} = req.body
    const {id} = req.params

    //console.log(comment)
    //console.log(id)
    
    if (!comment) {
      return res.status(400).json({error: 'comment is required'})
    }

    const updatedServiceComment = await serviceCommentService.updateServiceComment(id, {
      by_user: req.user.user_id,
      comment: comment
    })

    if (!updatedServiceComment) {
      return res.status(404).json({error: 'service comment not found'})
    }

    res.status(200).json(updatedServiceComment)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}

exports.deleteServiceComment  = async (req, res) => {
  try {
    const {id} = req.params

    const deleted = await serviceCommentService.deleteServiceComment(id)

    if (!deleted) {
      return res.status(404).json({error: 'service comment not found'})
    }

    res.status(200).json({success: deleted})
  }
  catch (err) {
    console.log(err)
    res.status(500).json({error: err.message})
  }
}
