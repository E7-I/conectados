import User from '../models/user.js'
import bcrypt from 'bcrypt'

const register = async (req, res) => {
  const { id, username, name, email, password } = req.body

  // se verifica que estén todos los campos requeridos
  if (!id || !username || !name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // status 409 si el usuario, mail o rut ya están registrados
    const existingUser = await User.findOne({
      $or: [{ id }, { username }, { email }],
    })
    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'RUT, username or email already in use' })
    }

    // pw hash
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // se crea y se guarda en la db
    const newUser = new User({
      id,
      username,
      name,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
        location: newUser.location,
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
