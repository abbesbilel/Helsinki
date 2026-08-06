const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    return blogs.reduce((max, blog) => {
        return blog.likes > max.likes ? blog : max
    })
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const blogsByAuthor = _.groupBy(blogs, 'author')

    const authorCounts = _.map(blogsByAuthor, (authorBlogs, author) => ({
        author: author,
        blogs: authorBlogs.length,
    }))

    return _.maxBy(authorCounts, 'blogs')
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const blogsByAuthor = _.groupBy(blogs, 'author')
    const authorLikes = _.map(blogsByAuthor, (authorBlogs, author) => ({
        author: author,
        likes: _.sumBy(authorBlogs, 'likes'),
    }))

    return _.maxBy(authorLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}