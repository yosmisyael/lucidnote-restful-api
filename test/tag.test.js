import supertest from 'supertest'
import { web } from '../src/apps/web.js'
import {
  createTestUser,
  removeTestUser,
  removeAllTestTag,
  createTestTag,
  getTestTag,
  createTestNotes,
  attachTag,
  getAttachedTag,
  deleteAllTestNotes
} from './test-util.js'
import { logger } from '../src/apps/logging.js'

describe('POST /api/tags', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeAllTestTag()
    await removeTestUser()
  })

  it('should can create a tag', async () => {
    const result = await supertest(web)
      .post('/api/tags')
      .set('Authorization', 'test')
      .send({
        tagName: 'test'
      })
    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()

    logger.info(result.body)
  })
  it('should reject create tag request if unauthorized', async () => {
    await createTestTag()
    const result = await supertest(web)
      .post('/api/tags')
      .set('Authorization', 'dumb')
      .send({
        tagName: 'test'
      })
    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
  it('should reject create tag request if body is invalid', async () => {
    const result = await supertest(web)
      .post('/api/tags')
      .set('Authorization', 'test')
      .send({
        tagName: ''
      })
    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
  it('should reject create tag request if tag already exist', async () => {
    await createTestTag()
    const result = await supertest(web)
      .post('/api/tags')
      .set('Authorization', 'test')
      .send({
        tagName: 'test'
      })
    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/tags/:username', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeAllTestTag()
    await removeTestUser()
  })

  it('should get all tag created by specific user', async () => {
    await createTestTag()

    const result = await supertest(web)
      .get('/api/tags/' + 'test')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data).toBeDefined()
    expect(result.body.data.length).toBeGreaterThan(0)
  })
  it('should return empty array if user has no tag', async () => {
    const result = await supertest(web)
      .get('/api/tags/' + 'test')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(0)
  })
})

describe('PUT /api/tags/:tagId', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeAllTestTag()
    await removeTestUser()
  })

  it('should rename tag', async () => {
    const testTag = await createTestTag()

    const result = await supertest(web)
      .put('/api/tags/' + testTag.id)
      .set('Authorization', 'test')
      .send({
        tagName: 'new test'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBe(testTag.id)
    expect(result.body.data.tagName).toBe('new test')
    expect(result.body.data.username).toBe(testTag.username)
  })
  it('should reject request if tag already exist', async () => {
    const testTag = await createTestTag()

    const result = await supertest(web)
      .put('/api/tags/' + testTag.id)
      .set('Authorization', 'test')
      .send({
        tagName: 'test'
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
  it('should reject request if tag name is invalid', async () => {
    const testTag = await createTestTag()

    const result = await supertest(web)
      .put('/api/tags/' + testTag.id)
      .set('Authorization', 'test')
      .send({
        tagName: '  '
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe('DELETE /api/tags/:tagId', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await deleteAllTestNotes()
    await removeAllTestTag()
    await removeTestUser()
  })

  it('should delete tag', async () => {
    let testTag = await createTestTag()

    const result = await supertest(web)
      .delete('/api/tags/' + testTag.id)
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')

    testTag = await getTestTag()
    expect(testTag).toBeNull()
  })
  it('should delete tag even it used on some notes', async () => {
    await createTestNotes()
    await createTestTag()
    await attachTag()

    const result = await supertest(web)
      .delete('/api/tags/' + 'test')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')

    const testTag = await getAttachedTag()
    expect(testTag).toBeNull()
  })
  it('should reject request if tag is not found', async () => {
    const result = await supertest(web)
      .delete('/api/tags/' + 'dumb')
      .set('Authorization', 'test')

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})
