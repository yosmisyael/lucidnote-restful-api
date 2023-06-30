/* eslint-disable no-undef */
import supertest from 'supertest'
import { web } from '../src/apps/web.js'
import { removeTestUser } from './test-util.js'

describe('POST /api/users', function () {
  afterEach(async () => {
    await removeTestUser()
  })

  it('should can register new user', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'test',
        password: 'rahasia',
        name: 'test',
        email: 'test@test.com'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('test')
    expect(result.body.data.password).toBeUndefined()
  })
})
