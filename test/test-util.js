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
export const deleteAllTestNotes = async () => {
  await prismaClient.note.deleteMany({
    where: {
      username: 'test'
    }
  })
}

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

export const createManyTestContacts = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.contact.create({
      data: {
        username: 'test',
        first_name: `test ${i}`,
        last_name: `test ${i}`,
        email: `test${i}@pzn.com`,
        phone: `080900000${i}`
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

// tag test util
export const removeTestTag = async () => {
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

export const getTestTag = async () => {
  return prismaClient.tag.findFirst({
    where: {
      id: 'test'
    }
  })
}

export const removeAllTestAddresses = async () => {
  await prismaClient.address.deleteMany({
    where: {
      contact: {
        username: 'test'
      }
    }
  })
}

export const createTestAddress = async () => {
  const contact = await getTestNotes()
  await prismaClient.address.create({
    data: {
      contact_id: contact.id,
      street: 'jalan test',
      city: 'kota test',
      province: 'provinsi test',
      country: 'indonesia',
      postal_code: '234234'
    }
  })
}

export const getTestAddress = async () => {
  return prismaClient.address.findFirst({
    where: {
      contact: {
        username: 'test'
      }
    }
  })
}
