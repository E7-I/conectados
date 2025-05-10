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

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

// taken from: https://gist.github.com/donpandix/f1d638c3a1a908be02d5
var Fn = {
	validaRut : function (rutCompleto) {
		if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
			return false;
		var tmp 	= rutCompleto.split('-');
		var digv	= tmp[1]; 
		var rut 	= tmp[0];
		if ( digv == 'K' ) digv = 'k' ;
		return (Fn.dv(rut) == digv );
	},
	dv : function(T){
		var M=0,S=1;
		for(;T;T=Math.floor(T/10))
			S=(S+T%10*(9-M++%6))%11;
		return S?S-1:'k';
	}
}

const registerValidation = (data) => {
  const { id, username, name, email, password } = data

  if (!id || !username || !name || !email || !password) {
    return { valid: false, message: 'All fields are required' }
  }

  if (!Fn.validaRut(id)) {
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

const updateUserValidation = (data) => {
  const { id, username, name, email, role, password, profile, location, professionalData } = data

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

  if (username && (username.length < 3 || username.length > 30)) {
    return {
      valid: false,
      message: 'Username must be between 3 and 30 characters'
    }
  }

  if (name && (name.length < 1 || name.length > 50)) {
    return { valid: false, message: 'Name must be between 1 and 50 characters' }
  }

  if (email && !validateEmail(email)) {
    return { valid: false, message: 'Invalid email format' }
  }

  if (role && !['client', 'professional', 'administrator'].includes(role)) {
    return { valid: false, message: 'Invalid role' }
  }

  if (password && (password.length < 6 || password.length > 20)) {
    return {
      valid: false,
      message: 'Password must be between 6 and 20 characters'
    }
  }

  if (password && password.includes(username)) {
    return { valid: false, message: 'Password cannot contain the username' }
  }

  if (profile) {
    if (profile.bio && profile.bio.length > 500) {
      return { valid: false, message: 'Biography must be less than 500 characters' }
    }

    if (profile.photoUrl && !isValidUrl(profile.photoUrl)) {
      return { valid: false, message: 'Invalid URL format' }
    }

    if (profile.contactInfo) {
      for (const contact of profile.contactInfo) {
        if (!contact.type || !contact.value) {
          return { valid: false, message: 'Contact info is required' }
        }
        if (!['email', 'phone', 'linkedin', 'whatsapp', 'website', 'other'].includes(contact.type)) {
          return { valid: false, message: 'Invalid contact type' }
        }
        if (contact.type === 'email' && !validateEmail(contact.value)) {
          return { valid: false, message: 'Invalid email format' }
        }
        if (contact.type !== 'email' && contact.value.length > 200) {
          return { valid: false, message: 'Contact value must be less than 100 characters' }
        }
      }
    }
  }

  if (location) {
    if (!location.lat || !location.lng) {
      return { valid: false, message: 'Both latitude and longitude are required' }
    }

    if (isNaN(location.lat) || isNaN(location.lng)) {
      return { valid: false, message: 'Invalid location format' }
    }
  }

  if (professionalData) {
    if (professionalData.availability) {
      for (const availability of professionalData.availability) {
        if (!availability.dayOfWeek || !availability.startHour || !availability.endHour) {
          return { valid: false, message: 'Availability is required' }
        }
        if (!['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].includes(availability.dayOfWeek)) {
          return { valid: false, message: 'Invalid day of the week' }
        }
        if (isNaN(Date.parse(`1970-01-01T${availability.startHour}:00Z`)) || isNaN(Date.parse(`1970-01-01T${availability.endHour}:00Z`))) {
          return { valid: false, message: 'Invalid time format' }
        }
      }
    }

    if (professionalData.certifications) {
      for (const certification of professionalData.certifications) {
        if (!certification.name || !certification.url) {
          return { valid: false, message: 'Certification name and URL are required' }
        }
        if (certification.description && certification.description.length > 500) {
          return { valid: false, message: 'Certification description must be less than 500 characters' }
        }
        if (!isValidUrl(certification.url)) {
          return { valid: false, message: 'Invalid URL format' }
        }
      }
    }
  }

  return { valid: true, message: 'Validation successful' }
}

export default {
  registerValidation,
  loginValidation,
  getUserByIdValidation,
  updateUserValidation,
}