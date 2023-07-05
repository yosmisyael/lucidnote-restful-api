import { prismaClient } from '../src/apps/database.js'
import bcrypt from 'bcrypt'

// user test util
export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: 'test'
    }
  })
}

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: 'test',
      password: await bcrypt.hash('test', 10),
      name: 'test',
      email: 'test@test.com',
      token: 'test'
    }
  })
}

export const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: 'test'
    }
  })
}

// note test util
export const createTestNotes = async () => {
  await prismaClient.note.create({
    data: {
      id: 'test',
      username: 'test',
      title: 'test',
      body: 'test',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  })
}

export const createManyTestNotes = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.note.create({
      data: {
        id: `test ${i}`,
        username: 'test',
        title: `test ${i}`,
        body: `test ${i}`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    })
  }
}

export const getTestNotes = async () => {
  return prismaClient.note.findFirst({
    where: {
      username: 'test',
      id: 'test'
    }
  })
}

export const deleteAllTestNotes = async () => {
  await prismaClient.note.deleteMany({
    where: {
      username: 'test'
    }
  })
}

// tag test util
export const removeAllTestTag = async () => {
  return prismaClient.tag.deleteMany({
    where: {
      username: 'test'
    }
  })
}

export const createTestTag = async () => {
  return prismaClient.tag.create({
    data: {
      username: 'test',
      tagName: 'test',
      id: 'test'
    }
  })
}

export const createManyTestTag = async () => {
  for (let i = 0; i < 7; i++) {
    await prismaClient.tag.create({
      data: {
        username: 'test',
        tagName: `test ${i}`,
        id: `test ${i}`
      }
    })
  }
}

export const getTestTag = async () => {
  return prismaClient.tag.findFirst({
    where: {
      id: 'test'
    }
  })
}

export const removeAllAttachedTag = async () => {
  return prismaClient.noteTag.deleteMany({
    where: {
      noteId: 'test'
    }
  })
}

export const attachTag = async () => {
  return prismaClient.noteTag.create({
    data: {
      noteId: 'test',
      tagId: 'test'
    }
  })
}

export const attachManyTestTag = async () => {
  for (let i = 0; i < 7; i++) {
    await prismaClient.noteTag.create({
      data: {
        tagId: `test ${i}`,
        noteId: 'test'
      }
    })
  }
}

export const getAttachedTag = async () => {
  return prismaClient.noteTag.findFirst({
    where: {
      noteId: 'test'
    }
  })
}
