import User from '../models/user.js'
import bcrypt from 'bcrypt'
import validator from '../helpers/validate.js'
import jwt from '../helpers/jwt.js'

const register = async (req, res) => {
  const { id, username, name, email, password } = req.body

  // validación de datos
  const { valid, message } = validator.registerValidation(req.body)
  if (!valid) {
    return res.status(400).json({ message })
  }

  try {
    // status 409 si el usuario, mail o rut ya están registrados
    const existingUser = await User.findOne({
      $or: [{ id }, { username }, { email }]
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
      password: hashedPassword
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
        location: newUser.location
      }
    })
  } catch (error) {
    console.error('Error during registration:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const login = async (req, res) => {
  const { username, email, password } = req.body

  // validación de datos
  const { valid, message } = validator.loginValidation(req.body)
  if (!valid) {
    return res.status(400).json({ message })
  }

  try {
    const user = await User.findOne({
      $or: [{ username }, { email }]
    })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // crear token JWT
    const token = jwt.createToken(user)

    /*
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    })
    */

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        location: user.location,
        token
      }
    })
  } catch (error) {
    console.error('Error during login:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default {
  register,
  login,
}
