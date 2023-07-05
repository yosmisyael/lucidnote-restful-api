import { prismaClient } from '../apps/database.js'
import { ResponseError } from '../error/response-error.js'
import { createNoteValidation, deleteNoteValidation, getNoteValidation, searchNoteValidation, updateNoteValidation } from '../validation/note-validation.js'
import { validate } from '../validation/validation.js'
import { v4 as uuid } from 'uuid'

const create = async (user, request) => {
  const note = validate(createNoteValidation, request)
  note.username = user.username

  const data = { ...note }
  data.createdAt = Date.now()
  data.updatedAt = data.createdAt
  data.id = uuid().toString()

  return await prismaClient.note.create({
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
      id: noteId,
      username: user.username
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
  note.createdAt = parseInt(note.createdAt)
  note.updatedAt = parseInt(note.updatedAt)
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

  let result = await prismaClient.note.update({
    where: {
      id: note.id
    },
    data: {
      title: note.title,
      body: note.body,
      updatedAt: Date.now()
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true
    }
  })

  result = JSON.stringify(result, (key, value) => (typeof value === 'bigint' ? parseInt(value) : value))
  result = JSON.parse(result)

  return result
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

const search = async (user, request) => {
  request = validate(searchNoteValidation, request)

  const skip = (request.page - 1) * request.size

  const filter = [{ username: user.username }]

  if (request.title) {
    filter.push({
      title: {
        contains: request.title
      }
    })
  }

  let notes = await prismaClient.note.findMany({
    where: {
      AND: filter
    },
    take: request.size,
    skip
  })
  notes = notes.map((note) => {
    note.createdAt = parseInt(note.createdAt)
    note.updatedAt = parseInt(note.updatedAt)
    return note
  })
  const countNotes = await prismaClient.note.count({
    where: {
      AND: filter
    }
  })
  return {
    data: notes,
    paging: {
      page: request.page,
      totalItem: countNotes,
      totalPage: Math.ceil(countNotes / request.size)
    }
  }
}

export default {
  create,
  get,
  update,
  remove,
  search
}
