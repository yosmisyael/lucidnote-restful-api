import { prismaClient } from '../apps/database.js'
import { ResponseError } from '../error/response-error.js'
import {
  createNoteValidation,
  deleteNoteValidation,
  filterNoteValidation,
  getNoteValidation,
  searchNoteValidation,
  updateNoteValidation
} from '../validation/note-validation.js'
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
  const id = validate(deleteNoteValidation, noteId)

  const countNote = await prismaClient.note.count({
    where: {
      username: user.username,
      id
    }
  })

  if (countNote !== 1) {
    throw new ResponseError(404, 'note is not found')
  }

  const countUseTag = await prismaClient.noteTag.count({
    where: {
      noteId: id
    }
  })

  if (countUseTag > 0) {
    await prismaClient.noteTag.deleteMany({
      where: {
        noteId: id
      }
    })
  }

  return prismaClient.note.delete({
    where: {
      id
    }
  })
}

const search = async (user, request) => {
  const { title, page, size } = validate(searchNoteValidation, request)

  const skip = (page - 1) * size

  const filters = [{ username: user.username }]

  if (title) {
    filters.push({
      title: {
        contains: title
      }
    })
  }

  let notes = await prismaClient.note.findMany({
    where: {
      AND: filters
    },
    take: size,
    skip
  })
  notes = notes.map((note) => {
    note.createdAt = parseInt(note.createdAt)
    note.updatedAt = parseInt(note.updatedAt)
    return note
  })
  const countNotes = await prismaClient.note.count({
    where: {
      AND: filters
    }
  })
  return {
    data: notes,
    paging: {
      page,
      totalItem: countNotes,
      totalPage: Math.ceil(countNotes / size)
    }
  }
}

const filterByTag = async (user, request) => {
  const { filterTags, page, size } = validate(filterNoteValidation, request)
  const skip = (page - 1) * size

  if (filterTags.length === 0) {
    throw new ResponseError(400, 'no tag selected')
  }

  const countNotes = await prismaClient.note.count({
    where: {
      username: user.username,
      tags: {
        some: {
          tagId: {
            in: filterTags
          }
        }
      }
    }
  })

  let result = await prismaClient.note.findMany({
    where: {
      username: user.username,
      tags: {
        some: {
          tagId: {
            in: filterTags
          }
        }
      }
    },
    take: size,
    skip
  })

  result = result.map(note => {
    note.createdAt = parseInt(note.createdAt)
    note.updatedAt = parseInt(note.updatedAt)
    return note
  })

  return {
    data: result,
    paging: {
      page,
      totalItem: countNotes,
      totalPage: Math.ceil(countNotes / size)
    }
  }
}

export default {
  create,
  get,
  update,
  remove,
  search,
  filterByTag
}
