import noteService from '../service/note-service.js'

const create = async (req, res, next) => {
  try {
    const user = req.user
    const request = req.body
    const result = await noteService.create(user, request)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const get = async (req, res, next) => {
  try {
    const user = req.user
    const noteId = req.params.id
    const result = await noteService.get(user, noteId)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const user = req.user
    const noteId = req.params.id
    const request = req.body
    request.id = noteId
    const result = await noteService.update(user, request)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const user = req.user
    const noteId = req.params.id
    await noteService.remove(user, noteId)
    res.status(200).json({
      data: 'OK'
    })
  } catch (error) {
    next(error)
  }
}

const search = async (req, res, next) => {
  try {
    const user = req.user
    const request = {
      title: req.query.title,
      size: req.query.size,
      page: req.query.page
    }
    const result = await noteService.search(user, request)
    res.status(200).json({
      data: result.data,
      paging: result.paging
    })
  } catch (error) {
    next(error)
  }
}

export default {
  create,
  get,
  update,
  remove,
  search
}
