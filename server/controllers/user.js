import User from '../models/user.js'
import bcrypt from 'bcrypt'

const register = async (req, res) => {
  const { username, name, email, password } = req.body

  // se verifica estén todos los campos requeridos
  if (!username || !name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // status 409 si el usuario o el email ya están registrados
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'Username or email already in use' })
    }

    // pw hash
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // se crea y se guarda en la db
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
      },
    })
  } catch (error) {
    console.error('Error during registration:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default {
  register,
}