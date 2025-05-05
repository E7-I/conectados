import express from 'express'
import userController from '../controllers/user.js'

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/id/:id', userController.getUserById)
router.get('/search', userController.searchUsers)
router.get('/', userController.getAllUsers)

export default router
