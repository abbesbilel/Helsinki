const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}