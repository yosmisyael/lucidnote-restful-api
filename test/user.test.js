/* eslint-disable no-undef */
import supertest from 'supertest'
import { web } from '../src/apps/web.js'
import { createTestUser, getTestUser, removeTestUser } from './test-util.js'
import { logger } from '../src/apps/logging.js'
import bcrypt from 'bcrypt'

describe('POST /api/users', function () {
  afterEach(async () => {
    await removeTestUser()
  })

  it('should register new user', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'test',
        password: 'test',
        name: 'test',
        email: 'test@test.com'
      })
    logger.info(result.body)
    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('test')
    expect(result.body.data.password).toBeUndefined()
  })
  it('should reject invalid request body', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: '',
        password: '',
        name: '',
        email: ''
      })
    logger.info(result.body)
    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
  it('should reject request if username already registered', async () => {
    await createTestUser()
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'test',
        password: 'test',
        name: 'test',
        email: 'test@test.com'
      })
    logger.info(result.body)
    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe('POST /api/users/login', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should allow login request from registered user', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'test',
        password: 'test'
      })

    logger.info(result.body)

    expect(result.status).toBe(200)
    expect(result.body.data.token).toBeDefined()
    expect(result.body.data.token).not.toBe('test')
  })
  it('should reject login if request body is invalid', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: '',
        password: ''
      })

    logger.info(result.body)

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
  it('should reject login if password is wrong', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'test',
        password: 'dumb'
      })

    logger.info(result.body)

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
  it('should reject login if username is wrong', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'dumb',
        password: 'dumb'
      })

    logger.info(result.body)

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/users/current', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should get current user', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('test')
  })
  it('should reject for request if token is invalid', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'dumb')

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe('PATCH /api/users/current', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('allow user to update data', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        name: 'dummy',
        password: 'dummy'
      })

    const user = await getTestUser()

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('dummy')
    expect(await bcrypt.compare('dummy', user.password)).toBe(true)
  })
  it('allow user to update name only', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        name: 'dummy'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('dummy')
  })
  it('allow user to update password only', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        password: 'dummy'
      })

    const user = await getTestUser()

    expect(result.status).toBe(200)
    expect(await bcrypt.compare('dummy', user.password)).toBe(true)
  })
  it('reject unauthorized user update request', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'dumb')
      .send({})

    expect(result.status).toBe(401)
  })
})

describe('DELETE /api/users/logout', function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })
  it('should allow user to logout', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'test')
    const user = await getTestUser()

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')
    expect(user.token).toBeNull()
  })
  it('reject logout request if token is invalid', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'dumb')

    expect(result.status).toBe(401)
  })
})
