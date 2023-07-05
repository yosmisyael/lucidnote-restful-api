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

const searchNoteValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  title: Joi.string().optional()
})

export {
  createNoteValidation,
  getNoteValidation,
  updateNoteValidation,
  deleteNoteValidation,
  searchNoteValidation
}
