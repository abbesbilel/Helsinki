const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('number of blogs returned is correct', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property is id', async () => {
    const response = await api.get('/api/blogs')
    const blogToCheck = response.body[0]

    assert.notStrictEqual(blogToCheck.id, undefined)
    assert.strictEqual(blogToCheck._id, undefined)
})

test('a note is added', async () => {
    const newBlog = {
        title: 'thank you for everything',
        author: 'the gratefull men',
        url: 'https://alolaàoa.com',
        likes: 785455555,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.blogsInDb()
    assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length + 1)

    const contents = notesAtEnd.map(b => b.title)
    assert(contents.includes('thank you for everything'))
})

test('likes property defaults to 0', async() => {
    const newBlog = {
        title: 'thank you for everything',
        author: 'the gratefull men',
        url: 'https://alolaàoa.com',
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})

test.only('400 bad request if title or url are missing', async() => {
    const newBlog = {
        author: 'the gratefull men',
        url: 'https://alolaàoa.com',
        likes: 785455555,
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

after(async () => {
    await mongoose.connection.close()
})