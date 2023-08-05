import supertest from 'supertest'
import { web } from '../src/apps/web.js'
import {
  attachManyTestTag,
  attachTag,
  createManyTestTag,
  createTestNotes,
  createTestTag,
  createTestUser,
  deleteAllTestNotes,
  getAttachedTag,
  removeAllAttachedTag,
  removeAllTestTag,
  removeTestUser
} from './test-util.js'

describe('POST /api/notes/:noteId/tags', function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestNotes()
  })

  afterEach(async () => {
    await removeAllAttachedTag()
    await removeAllTestTag()
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('should attach tag to note', async () => {
    const testTag = await createTestTag()

    const result = await supertest(web)
      .post('/api/notes/test/tags')
      .set('Authorization', 'test')
      .send({
        selectedTag: [testTag.id]
      })

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')
  })
  it('should reject request if tag is not found', async () => {
    const result = await supertest(web)
      .post('/api/notes/test/tags')
      .set('Authorization', 'test')
      .send({
        selectedTag: ['test']
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/notes/:noteId/tags', function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestNotes()
    await createManyTestTag()
  })

  afterEach(async () => {
    await removeAllAttachedTag()
    await removeAllTestTag()
    await deleteAllTestNotes()
    await removeTestUser()
  })
  it('should return empty array if note does not have any tag', async () => {
    const result = await supertest(web)
      .get('/api/notes/test/tags')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data).toBeDefined()
  })

  it('should get all attached tag of a note', async () => {
    await attachManyTestTag()

    const result = await supertest(web)
      .get('/api/notes/test/tags')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(7)
  })
})

describe('PUT /api/notes/:noteId/tags', function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestNotes()
    await createTestTag()
    await createManyTestTag()
    await attachTag()
  })

  afterEach(async () => {
    await removeAllAttachedTag()
    await removeAllTestTag()
    await deleteAllTestNotes()
    await removeTestUser()
  })

  it('should allow user to update attached tag', async () => {
    let result = await supertest(web)
      .put('/api/notes/test/tags')
      .set('Authorization', 'test')
      .send({
        selectedTag: ['test 1']
      })

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')

    result = await getAttachedTag()
    expect(result.tagId).toBe('test 1')
    expect(result.noteId).toBe('test')
  })
  it('should reject request if requsted tag is not exist', async () => {
    const result = await supertest(web)
      .put('/api/notes/test/tags')
      .set('Authorization', 'test')
      .send({
        selectedTag: ['dumb']
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})
