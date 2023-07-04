import tagService from '../service/tag-service.js'

const create = async (req, res, next) => {
  try {
    const user = req.user
    const request = req.body
    const result = await tagService.create(user, request)
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
    const request = req.body
    const tagId = req.params.id
    request.id = tagId
    const result = await tagService.update(user, request)
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
    await tagService.remove(user, noteId)
    res.status(200).json({
      data: 'OK'
    })
  } catch (error) {
    next(error)
  }
}

export default { create, update, remove }
