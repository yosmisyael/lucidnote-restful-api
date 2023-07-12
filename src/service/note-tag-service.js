import { prismaClient } from '../apps/database.js'
import { ResponseError } from '../error/response-error.js'
import { addTagValidation, getNoteValidation } from '../validation/note-validation.js'
import { validate } from '../validation/validation.js'

const addTag = async (noteId, request) => {
  noteId = validate(getNoteValidation, noteId)
  const { selectedTag } = validate(addTagValidation, request)

  for (const tag of selectedTag) {
    const tagInDatabase = await prismaClient.tag.findUnique({
      where: {
        id: tag
      }
    })
    if (!tagInDatabase) {
      throw new ResponseError(404, 'the requested tags contain invalid tags')
    }
  }

  const data = selectedTag.map((tagId) => (
    {
      tagId,
      noteId
    }
  ))

  return prismaClient.noteTag.createMany({
    data
  })
}

const getTag = async (noteId) => {
  noteId = validate(getNoteValidation, noteId)

  const count = await prismaClient.noteTag.count({
    where: {
      noteId
    }
  })

  if (count < 1) {
    throw new ResponseError(404, 'note does not have any tags')
  }

  const tagIdList = await prismaClient.noteTag.findMany({
    where: {
      noteId
    }
  })

  const tagNameList = await Promise.all(tagIdList.map(async (item) => {
    const tag = await prismaClient.tag.findUnique({
      where: {
        id: item.tagId
      },
      select: {
        tagName: true
      }
    })
    return tag.tagName
  }))

  return tagNameList
}

const updateTag = async (noteId, request) => {
  noteId = validate(getNoteValidation, noteId)
  const { selectedTag } = validate(addTagValidation, request)

  for (const tag of selectedTag) {
    const tagInDatabase = await prismaClient.tag.findUnique({
      where: {
        id: tag
      }
    })
    if (!tagInDatabase) {
      throw new ResponseError(404, `tag with id ${tag} is not exist`)
    }
  }

  try {
    return prismaClient.$transaction(async () => {
      await prismaClient.noteTag.deleteMany({
        where: {
          noteId
        }
      })

      const data = selectedTag.map(tagId => ({
        noteId,
        tagId
      }))

      await prismaClient.noteTag.createMany({
        data
      })
    })
  } catch (error) {
    throw new ResponseError(500, 'failed to update tag')
  }
}

export default {
  addTag,
  getTag,
  updateTag
}
