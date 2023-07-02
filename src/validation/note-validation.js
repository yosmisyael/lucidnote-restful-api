import Joi from 'joi'

const createNoteValidation = Joi.object({
  title: Joi.string().max(100).required(),
  body: Joi.string().allow(null, '').optional()
})

const getNoteValidation = Joi.string().max(100).required()

const updateNoteValidation = Joi.object({
  id: Joi.string().max(100).required(),
  title: Joi.string().max(100).required(),
  body: Joi.string().allow(null, '').optional()
})

const deleteNoteValidation = Joi.string().max(100).required()

export {
  createNoteValidation,
  getNoteValidation,
  updateNoteValidation,
  deleteNoteValidation
}
