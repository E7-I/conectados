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

const getUserById = async (req, res) => {
  const { id } = req.params

  const { valid, message } = validator.getUserByIdValidation(req.params)

  if (!valid) {
    return res.status(400).json({ message })
  }

  try {
    const user = await User.findOne({ id }).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ user })
  } catch (error) {
    console.error('Error retrieving user by ID:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1    // página actual
  const limit = parseInt(req.query.limit) || 10 // cantidad de elementos por página

  const skip = (page - 1) * limit

  try {
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)

    const totalUsers = await User.countDocuments()

    return res.status(200).json({
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error('Error retrieving users:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const searchUsers = async (req, res) => {
  const { username, name, email, role } = req.query
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const filters = {}

  if (username) filters.username = { $regex: username, $options: 'i' }
  if (name) filters.name = { $regex: name, $options: 'i' }
  if (email) filters.email = { $regex: email, $options: 'i' }
  if (role) filters.role = role

  try {
    const users = await User.find(filters)
      .select('-password')
      .skip(skip)
      .limit(limit)

    const totalUsers = await User.countDocuments(filters)

    return res.status(200).json({
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    })
  } catch (error) {
    console.error('Error searching users:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  const { valid, message } = validator.updateUserValidation({ id, ...updates })
  if (!valid) {
    return res.status(400).json({ message })
  }

  try {
    const user = await User.findOne({ id })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (updates.username) user.username = updates.username
    if (updates.name) user.name = updates.name
    if (updates.email) user.email = updates.email
    if (updates.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(updates.password, salt)
    }
    if (updates.profile) user.profile = updates.profile
    if (updates.location) user.location = updates.location
    if (updates.role) user.role = updates.role
    if (updates.professionalData) user.professionalData = updates.professionalData

    user.updatedAt = new Date()

    await user.save()

    const sanitizedUser = await User.findOne({ id }).select('-password')

    return res.status(200).json({
      message: 'User updated successfully',
      user: sanitizedUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default {
  register,
  login,
  getUserById,
  getAllUsers,
  searchUsers,
  updateUser
}
