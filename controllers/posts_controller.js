import mongoose from 'mongoose'
import PostMessage from '../models/postMessage.js'

export const getPosts = async (req, res) => {
  const { page } = req.query
  try {
    const LIMIT = 9
    const startIndex = (Number(page) - 1) * LIMIT //startinf index of every page
    const total = await PostMessage.countDocuments({}) //to get total number of pages
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex) //newest to oldest

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    })
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const createPosts = async (req, res) => {
  const post = req.body
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  })
  try {
    await newPost.save()
    res.status(200).json(newPost)
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params
  const post = req.body

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No post with the id')

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  })

  res.send(updatedPost)
}

export const deletePost = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No post with the id')

  await PostMessage.findByIdAndDelete(id)
  res.json({ message: 'Post deleted successfully' })
}

export const likePost = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No post with the id')

  if (!req.userId) return res.json({ message: 'unAuthenticated' })

  const post = await PostMessage.findById(id)

  const index = post.likes.findIndex((id) => id === String(req.userId))

  if (index === -1) {
    post.likes.push(req.userId)
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId))
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  })

  res.json(updatedPost)
}

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query
  try {
    const title = new RegExp(searchQuery, 'i')

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    })

    res.json({ data: posts })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await PostMessage.findById(id)
    res.status(200).json(post)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const commentPost = async (req, res) => {
  const { id } = req.params
  const { value } = req.body

  const post = await PostMessage.findById(id)
  post.comments.push(value)

  const updatePost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  })

  res.json(updatePost)
}
