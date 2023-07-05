import noteTagService from '../service/note-tag-service.js'

const addTag = async (req, res, next) => {
  try {
    const noteId = req.params.noteId
    const request = req.body
    await noteTagService.addTag(noteId, request)
    res.status(200).json({
      data: 'OK'
    })
  } catch (error) {
    next(error)
  }
}

const getTag = async (req, res, next) => {
  try {
    const noteId = req.params.noteId
    const result = await noteTagService.getTag(noteId)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const updateTag = async (req, res, next) => {
  try {
    const noteId = req.params.noteId
    const request = req.body
    await noteTagService.updateTag(noteId, request)
    res.status(200).json({
      data: 'OK'
    })
  } catch (error) {
    next(error)
  }
}

export default {
  addTag,
  getTag,
  updateTag
}
