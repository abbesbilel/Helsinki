const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Learning to test the backend',
    author: 'abbes bilel',
    url: 'https://somthing.com',
    likes: 798654123,
  },
  {
    title: 'Za3ama ya wlidi',
    author: 'Aymen pirate',
    url: 'https://test_test.com',
    likes: 123456789,
  }
]

const initialUsers = [
  {
    username: 'za3im',
    name: 'aymen',
    password: '12345678'
  },
  {
    username: 'abbes bilel',
    name: 'bilel',
    password: '12345678'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb
}