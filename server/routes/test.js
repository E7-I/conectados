import express from 'express'
import User from '../models/user.js'

const router = express.Router()

router.post('/reset', async (req, res) => {
  if (process.env.NODE_ENV !== 'test') {
    return res.status(403).json({ message: 'Not allowed' })
  }

  try {
    await User.deleteMany({})
    res.status(200).json({ message: 'Database reset' })
  } catch (error) {
    res.status(500).json({ message: 'Error resetting database' })
  }
})

export default router