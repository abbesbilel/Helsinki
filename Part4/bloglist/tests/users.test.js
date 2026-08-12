const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

test('invalid password users are not created', async () => {
    const usersAtStart = await helper.usersInDb()
    const invalidUser = {
        username: 'validuser',
        name: 'Valid Name',
        password: '12'
    }
    const response = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)

    assert(response.body.error.includes('at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})