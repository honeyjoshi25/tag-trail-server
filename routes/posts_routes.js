import express from 'express'
import {
  getPosts,
  createPosts,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
  getPost,
  commentPost
} from '../controllers/posts_controller.js'
import Auth from '../middleware/Auth.js'

const router = express.Router()

router.get('/', getPosts)
router.get('/search', getPostsBySearch)
router.get('/:id',getPost)
router.post('/', Auth, createPosts)
router.patch('/:id', Auth, updatePost)
router.delete('/:id', Auth, deletePost)
router.patch('/:id/likePost', Auth, likePost)
router.post('/:id/commentPost', Auth, commentPost)


export default router
