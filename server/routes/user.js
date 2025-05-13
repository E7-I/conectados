import express from 'express'
import userController from '../controllers/user.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/id/:id', userController.getUserById)
router.get('/search', userController.searchUsers)
// router.get('/', auth, userController.getAllUsers)
router.get('/', userController.getAllUsers)
router.put('/update/:id', userController.updateUser)
router.get('/me', auth, userController.getMe)

export default router
