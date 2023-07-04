import Joi from 'joi'

const createTagValidation = Joi.object({ tagName: Joi.string().min(1).max(100).required() })

const updateTagValidation = Joi.object({
  id: Joi.string().max(100).required(),
  tagName: Joi.string().min(1).max(100).required()
})

const deleteTagValidation = Joi.string().max(100).required()

export { createTagValidation, updateTagValidation, deleteTagValidation }
