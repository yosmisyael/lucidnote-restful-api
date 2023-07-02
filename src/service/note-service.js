import { prismaClient } from '../apps/database.js'
import { ResponseError } from '../error/response-error.js'
import { createNoteValidation, deleteNoteValidation, getNoteValidation, updateNoteValidation } from '../validation/note-validation.js'
import { validate } from '../validation/validation.js'
import { v4 as uuid } from 'uuid'

const create = async (user, request) => {
  const note = validate(createNoteValidation, request)
  note.username = user.username

  const data = { ...note }
  data.createdAt = Date.now().toString()
  data.updatedAt = data.createdAt
  data.id = uuid().toString()

  return prismaClient.note.create({
    data,
    select: {
      id: true
    }
  })
}

const get = async (user, noteId) => {
  noteId = validate(getNoteValidation, noteId)

  const note = await prismaClient.note.findFirst({
    where: {
      username: user.username,
      id: noteId
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!note) {
    throw new ResponseError(404, 'note is not found')
  }

  return note
}

const update = async (user, request) => {
  const note = validate(updateNoteValidation, request)
  const countNote = await prismaClient.note.count({
    where: {
      username: user.username,
      id: note.id
    }
  })

  if (countNote !== 1) {
    throw new ResponseError(404, 'note is not found ')
  }

  return prismaClient.note.update({
    where: {
      id: note.id
    },
    data: {
      title: note.title,
      body: note.body,
      updatedAt: Date.now().toString()
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

const remove = async (user, noteId) => {
  const note = validate(deleteNoteValidation, noteId)

  const countNote = await prismaClient.note.count({
    where: {
      username: user.username,
      id: note
    }
  })

  if (countNote !== 1) {
    throw new ResponseError(404, 'note is not found')
  }

  return prismaClient.note.delete({
    where: {
      id: note
    }
  })
}

export default {
  create,
  get,
  update,
  remove
}
