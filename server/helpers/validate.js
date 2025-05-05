const validateEmail = (email) => {
  if (!email) return false
  if (email.length < 6 || email.length > 320) return false
  const emailRegex =
    /^(?!.*\.\.)([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/
  if (!emailRegex.test(email)) return false
  const [local, domain] = email.split('@')
  if (!local || !domain) return false
  if (local.length > 64 || domain.length > 255) return false
  return true
}

const registerValidation = (data) => {
  const { id, username, name, email, password } = data

  if (!id || !username || !name || !email || !password) {
    return { valid: false, message: 'All fields are required' }
  }

  if (isNaN(id)) {
    return { valid: false, message: 'Invalid ID format' }
  }

  if (id % 1 !== 0) {
    return { valid: false, message: 'Invalid ID format' }
  }

  if (id < 1) {
    return { valid: false, message: 'Invalid ID format' }
  }

  if (username.length < 3 || username.length > 30) {
    return {
      valid: false,
      message: 'Username must be between 3 and 30 characters'
    }
  }

  if (name.length < 1 || name.length > 50) {
    return { valid: false, message: 'Name must be between 1 and 50 characters' }
  }

  if (!validateEmail(email)) {
    return { valid: false, message: 'Invalid email format' }
  }

  if (password.length < 6 || password.length > 20) {
    return {
      valid: false,
      message: 'Password must be between 6 and 20 characters'
    }
  }

  if (password.includes(username)) {
    return { valid: false, message: 'Password cannot contain the username' }
  }

  return { valid: true, message: 'Validation successful' }
}

const loginValidation = (data) => {
  const { username, email, password } = data

  if (!username && !email) {
    return { valid: false, message: 'Username or email is required' }
  }

  if (!password) {
    return { valid: false, message: 'Password is required' }
  }

  return { valid: true, message: 'Validation successful' }
}

const getUserByIdValidation = (data) => {
  const { id } = data

  if (!id) {
    return { valid: false, message: 'ID is required' }
  }

  if (isNaN(id)) {
    return { valid: false, message: 'Invalid ID format' }
  }

  if (id % 1 !== 0) {
    return { valid: false, message: 'Invalid ID format' }
  }

  if (id < 1) {
    return { valid: false, message: 'Invalid ID format' }
  }

  return { valid: true, message: 'Validation successful' }
}

export default {
  registerValidation,
  loginValidation,
  getUserByIdValidation
}