/* eslint-disable no-undef */
import supertest from 'supertest'
import { web } from '../src/apps/web.js'
import { createManyTestNotes, createTestNotes, createTestUser, deleteAllTestNotes, getTestNotes, removeTestUser } from './test-util.js'
import { logger } from '../src/apps/logging.js'

describe('POST /api/notes', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('allow user to create a new note', async () => {
    const result = await supertest(web)
      .post('/api/notes')
      .set('Authorization', 'test')
      .send({
        title: 'test',
        body: 'test'
      })
    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
  })
  it('reject invalid body request', async () => {
    const result = await supertest(web)
      .post('/api/notes')
      .set('Authorization', 'test')
      .send({
        title: '',
        body: ''
      })
    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/notes', function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestNotes()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('allow user to get a note', async () => {
    const testNote = await getTestNotes()

    const result = await supertest(web)
      .get('/api/notes/' + testNote.id)
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBe(testNote.id)
    expect(result.body.data.title).toBe(testNote.title)
    expect(result.body.data.body).toBe(testNote.body)
    expect(result.body.data.createdAt).toBe(parseInt(testNote.createdAt))
    expect(result.body.data.updatedAt).toBe(parseInt(testNote.updatedAt))

    logger.info(result)
  })
  it('reject get note request if id is not found', async () => {
    const result = await supertest(web)
      .get('/api/notes/' + 'dumb')
      .set('Authorization', 'test')

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe('PUT /api/note/:id', function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestNotes()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('allow update note request from coresponding user', async () => {
    const testNote = await getTestNotes()

    const result = await supertest(web)
      .put('/api/notes/' + testNote.id)
      .set('Authorization', 'test')
      .send({
        title: 'test updated',
        body: ''
      })
    expect(result.status).toBe(200)
    expect(result.body.data.id).toBe(testNote.id)
    expect(result.body.data.title).toBe('test updated')
    expect(result.body.data.body).toBe('')
    expect(result.body.data.updatedAt).not.toBe(result.body.data.createdAt)

    logger.info(result)
  })
  it('reject update note request if request body is invalid', async () => {
    const testNote = await getTestNotes()

    const result = await supertest(web)
      .put('/api/notes/' + testNote.id)
      .set('Authorization', 'test')
      .send({
        title: '',
        body: ''
      })
    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
  it('reject update note request if note id not found', async () => {
    const result = await supertest(web)
      .put('/api/notes/' + 'dumb')
      .set('Authorization', 'test')
      .send({
        title: 'test updated',
        body: ''
      })
    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe('DELETE /api/users/:id', function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestNotes()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('allow user to delete a note', async () => {
    let testNote = await getTestNotes()

    const result = await supertest(web)
      .delete('/api/notes/' + testNote.id)
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')

    testNote = await getTestNotes()
    expect(testNote).toBeNull()
  })
  it('reject delete request if note id is not found', async () => {
    const result = await supertest(web)
      .delete('/api/notes/' + 'dumb')
      .set('Authorization', 'test')

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/notes', function () {
  beforeEach(async () => {
    await createTestUser()
    await createManyTestNotes()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('allow search without any parameter', async () => {
    const result = await supertest(web)
      .get('/api/notes')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(15)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.totalPage).toBe(2)
    expect(result.body.paging.totalItem).toBe(15)
  })
  it('allow search to page 2', async () => {
    const result = await supertest(web)
      .get('/api/notes')
      .set('Authorization', 'test')
      .query({ page: 2 })

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(15)
    expect(result.body.paging.page).toBe(2)
    expect(result.body.paging.totalPage).toBe(2)
    expect(result.body.paging.totalItem).toBe(15)
  })
  it('allow search using name', async () => {
    const result = await supertest(web)
      .get('/api/notes')
      .set('Authorization', 'test')
      .query({ title: 'test 7' })

    expect(result.status).toBe(200)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.data.length).toBe(1)
    expect(result.body.paging.totalPage).toBe(1)
    expect(result.body.paging.totalItem).toBe(1)
  })
})
