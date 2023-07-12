import { validate } from '../validation/validation.js'
import { createTagValidation, deleteTagValidation, getAllTagValidation, updateTagValidation } from '../validation/tag-validation.js'
import { prismaClient } from '../apps/database.js'
import { ResponseError } from '../error/response-error.js'
import { v4 as uuid } from 'uuid'

const create = async (user, request) => {
  const data = validate(createTagValidation, request)

  if (data.tagName.trim() === '' || data.tagName.replace(/\s+/g, '') === '') {
    throw new ResponseError(400, 'tag is not allowed to be whitespace only')
  }

  const countTag = await prismaClient.tag.count({
    where: {
      username: user.username,
      tagName: data.tagName
    }
  })

  if (countTag === 1) {
    throw new ResponseError(400, 'tag already exist')
  }

  data.id = uuid().toString()
  data.username = user.username

  return prismaClient.tag.create({
    data,
    select: {
      id: true
    }
  })
}

const get = async (user) => {
  user = validate(getAllTagValidation, user.username)

  const count = await prismaClient.tag.count({
    where: {
      username: user
    }
  })

  if (count === 0) {
    return []
  }

  return prismaClient.tag.findMany({
    where: {
      username: user
    },
    select: {
      tagName: true,
      id: true
    }
  })
}

const update = async (user, request) => {
  const data = validate(updateTagValidation, request)

  if (data.tagName.trim() === '' || data.tagName.replace(/\s+/g, '') === '') {
    throw new ResponseError(400, 'tag is not allowed to be whitespace only')
  }

  const countTag = await prismaClient.tag.count({
    where: {
      username: user.username,
      tagName: data.tagName
    }
  })

  if (countTag === 1) {
    throw new ResponseError(400, 'tag already exist')
  }

  data.username = user.username

  return prismaClient.tag.update({
    where: {
      id: data.id
    },
    data,
    select: {
      id: true,
      username: true,
      tagName: true
    }
  })
}

const remove = async (user, tagId) => {
  const id = validate(deleteTagValidation, tagId)

  const countTag = await prismaClient.tag.count({
    where: {
      id,
      username: user.username
    }
  })

  if (countTag !== 1) {
    throw new ResponseError(404, 'tag is not found')
  }

  const countUseTag = await prismaClient.noteTag.count({
    where: {
      tagId: id
    }
  })

  if (countUseTag > 0) {
    await prismaClient.noteTag.deleteMany({
      where: {
        tagId: id
      }
    })
  }

  return prismaClient.tag.delete({
    where: {
      id
    }
  })
}

export default { create, update, remove, get }
