/* eslint-disable no-undef */
import supertest from 'supertest'
import { web } from '../src/apps/web.js'
import {
  attachTag,
  createManyTestNotes,
  createTestNotes,
  createTestTag,
  createTestUser,
  deleteAllTestNotes,
  getTestNotes,
  removeAllTestTag,
  removeTestUser
} from './test-util.js'
import { logger } from '../src/apps/logging.js'

describe('POST /api/notes', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('should can create a new note', async () => {
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
  it('should reject create request if request body is invalid', async () => {
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

describe('GET /api/notes/:noteId', function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestNotes()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('should can get a note', async () => {
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
  it('should reject get note request if id is not found', async () => {
    const result = await supertest(web)
      .get('/api/notes/' + 'dumb')
      .set('Authorization', 'test')

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe('PUT /api/note/:noteId', function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestNotes()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('should update tag of a note when provided with valid tag data', async () => {
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
  it('should reject update note request if request body is invalid', async () => {
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
  it('should reject update note request if note id is not found', async () => {
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

describe('DELETE /api/users/:noteId', function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestNotes()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeAllTestTag()
    await removeTestUser()
  })

  it('should can delete note', async () => {
    let testNote = await getTestNotes()

    const result = await supertest(web)
      .delete('/api/notes/' + testNote.id)
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')

    testNote = await getTestNotes()
    expect(testNote).toBeNull()
  })
  it('should can delete notes that have tags', async () => {
    await createTestTag()
    await attachTag()

    const result = await supertest(web)
      .delete('/api/notes/test')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')

    const testNote = await getTestNotes()
    expect(testNote).toBeNull()
  })
  it('should reject the delete request if the note ID is not found', async () => {
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

  it('should can search without any parameter', async () => {
    const result = await supertest(web)
      .get('/api/notes')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(10)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.totalPage).toBe(2)
    expect(result.body.paging.totalItem).toBe(15)
  })
  it('should can search to page 2', async () => {
    const result = await supertest(web)
      .get('/api/notes')
      .set('Authorization', 'test')
      .query({ page: 2 })

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(5)
    expect(result.body.paging.page).toBe(2)
    expect(result.body.paging.totalPage).toBe(2)
    expect(result.body.paging.totalItem).toBe(15)
  })
  it('should can search using name', async () => {
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
