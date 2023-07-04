/* eslint-disable no-undef */
import supertest from 'supertest'
import { web } from '../src/apps/web'
import { createTestUser, removeTestUser, removeTestTag, createTestTag, getTestTag } from './test-util'
import { logger } from '../src/apps/logging'

describe('POST /api/tags', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestTag()
    await removeTestUser()
  })

  it('allow user to create a tag', async () => {
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
  it('reject create tag request if unauthorized', async () => {
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
  it('reject create tag request if body is invalid', async () => {
    const result = await supertest(web)
      .post('/api/tags')
      .set('Authorization', 'test')
      .send({
        tagName: ''
      })
    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
  it('reject create tag request if tag already exist', async () => {
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

describe('PUT /api/tags/id', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestTag()
    await removeTestUser()
  })

  it('allow user to rename their tag', async () => {
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
  it('reject request if tag already exist', async () => {
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
  it('reject request if tag name is invalid', async () => {
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

describe('DELETE /api/tags/id', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestTag()
    await removeTestUser()
  })

  it('allow user to delete their tag', async () => {
    let testTag = await createTestTag()

    const result = await supertest(web)
      .delete('/api/tags/' + testTag.id)
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')

    testTag = await getTestTag()
    expect(testTag).toBeNull()
  })
  it('reject request if tag is not found', async () => {
    const result = await supertest(web)
      .delete('/api/tags/' + 'dumb')
      .set('Authorization', 'test')

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})
