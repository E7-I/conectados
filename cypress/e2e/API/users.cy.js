const BASE_URL = 'http://localhost:5001/api/users'

describe('Register Methods', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5001/api/test/reset')
  })

  it('TC01: Debe crear un nuevo usuario', () => {
    cy.fixture('user1').then((user) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/register`,
        body: user,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.message).to.eq('User registered successfully')
      })
    })
  })

  it('TC02: No debe crear un usuario que ya existe', () => {
    cy.fixture('user1').then((user) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/register`,
        body: user,
        failOnStatusCode: false
      }).then((res1) => {
        expect(res1.status).to.eq(201)

        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res2) => {
          expect(res2.status).to.eq(409)
          expect(res2.body.message).to.eq(
            'RUT, username or email already in use'
          )
        })
      })
    })
  })

  describe('TC03: Validación de longitud del campo username', () => {
    it('TC03.1: No debe permitir username de 2 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.username = 'ab'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq(
            'Username must be between 3 and 30 characters'
          )
        })
      })
    })

    it('TC03.2: Debe permitir username de 3 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.username = 'abc'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(201)
          expect(res.body.user.username).to.eq(user.username)
        })
      })
    })

    it('TC03.3: Debe permitir username de 30 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.username = 'a'.repeat(30)
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(201)
          expect(res.body.user.username).to.eq(user.username)
        })
      })
    })

    it('TC03.4: No debe permitir username de 31 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.username = 'a'.repeat(31)
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq(
            'Username must be between 3 and 30 characters'
          )
        })
      })
    })
  })

  describe('TC04: Validación de longitud del campo name', () => {
    it('TC04.1: No debe permitir name vacío', () => {
      cy.fixture('user1').then((user) => {
        user.name = ''
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('All fields are required')
        })
      })
    })

    it('TC04.2: Debe permitir name de 1 caracter', () => {
      cy.fixture('user1').then((user) => {
        user.name = 'a'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(201)
          expect(res.body.user.name).to.eq(user.name)
        })
      })
    })

    it('TC04.3: Debe permitir name de 50 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.name = 'a'.repeat(50)
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(201)
          expect(res.body.user.name).to.eq(user.name)
        })
      })
    })

    it('TC04.4: No debe permitir name de 51 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.name = 'a'.repeat(51)
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq(
            'Name must be between 1 and 50 characters'
          )
        })
      })
    })
  })

  describe('TC05: Validación de formato del campo email', () => {
    it('TC05.1: Debe permitir un email válido', () => {
      cy.fixture('user1').then((user) => {
        user.email = 'valid@gmail.com'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(201)
          expect(res.body.message).to.eq('User registered successfully')
        })
      })
    })

    it('TC05.2: No debe permitir un email inválido (menor a 6 caracteres)', () => {
      cy.fixture('user1').then((user) => {
        user.email = 'a@b.c'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Invalid email format')
        })
      })
    })

    it('TC05.3: No debe permitir un email inválido (sin @)', () => {
      cy.fixture('user1').then((user) => {
        user.email = 'invalidemail.com'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Invalid email format')
        })
      })
    })

    it('TC05.5: No debe permitir un email inválido (sin dominio)', () => {
      cy.fixture('user1').then((user) => {
        user.email = 'invalid@'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Invalid email format')
        })
      })
    })

    it('TC05.4: No debe permitir un email inválido (sin local)', () => {
      cy.fixture('user1').then((user) => {
        user.email = '@gmail.com'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Invalid email format')
        })
      })
    })

    it('TC05.6: No debe permitir un email inválido (sin extensión)', () => {
      cy.fixture('user1').then((user) => {
        user.email = 'invalid@email'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Invalid email format')
        })
      })
    })

    it('TC05.7: No debe permitir un email inválido (. al inicio)', () => {
      cy.fixture('user1').then((user) => {
        user.email = '.invalid@email.com'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Invalid email format')
        })
      })
    })

    it('TC05.8: No debe permitir un email inválido (. antes de la extensión)', () => {
      cy.fixture('user1').then((user) => {
        user.email = 'invalid@email..com'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Invalid email format')
        })
      })
    })

    it('TC05.9: No debe permitir un email de más de 320 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.email = 'a'.repeat(64) + '@' + 'b'.repeat(252) + '.com' // 321 caracteres
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Invalid email format')
        })
      })
    })
  })

  describe('TC06: Validación de longitud del campo password', () => {
    it('TC06.1: No debe permitir password de 5 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.password = '12345'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq(
            'Password must be between 6 and 20 characters'
          )
        })
      })
    })

    it('TC06.2: Debe permitir password de 6 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.password = '123456'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(201)
          expect(res.body.message).to.eq('User registered successfully')
        })
      })
    })

    it('TC06.3: Debe permitir password de 20 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.password = 'a'.repeat(20)
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(201)
          expect(res.body.message).to.eq('User registered successfully')
        })
      })
    })

    it('TC06.4: No debe permitir password de 21 caracteres', () => {
      cy.fixture('user1').then((user) => {
        user.password = 'a'.repeat(21)
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq(
            'Password must be between 6 and 20 characters'
          )
        })
      })
    })

    it('TC06.5: No debe permitir password que contenga el username', () => {
      cy.fixture('user1').then((user) => {
        user.password = user.username + '123'
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/register`,
          body: user,
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Password cannot contain the username')
        })
      })
    })
  })
})

describe('Login Methods', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5001/api/test/reset')
  })

  it('TC01: Debe iniciar sesión con credenciales válidas', () => {
    cy.fixture('user1').then((user) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/register`,
        body: user,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.message).to.eq('User registered successfully')

        cy.request({
          method: 'POST',
          url: `${BASE_URL}/login`,
          body: {
            username: user.username,
            password: user.password
          },
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body.message).to.eq('Login successful')
          expect(res.body.user.username).to.eq(user.username)
        })
      })
    })
  })

  it('TC02: No debe iniciar sesión con credenciales inválidas', () => {
    cy.fixture('user1').then((user) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/register`,
        body: user,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.message).to.eq('User registered successfully')

        cy.request({
          method: 'POST',
          url: `${BASE_URL}/login`,
          body: {
            username: user.username,
            password: 'wrongpassword'
          },
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(401)
          expect(res.body.message).to.eq('Invalid credentials')
        })
      })
    })
  })

  it('TC03: No pueden faltar los campos username y email al mismo tiempo', () => {
    cy.fixture('user1').then((user) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/register`,
        body: user,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.message).to.eq('User registered successfully')

        cy.request({
          method: 'POST',
          url: `${BASE_URL}/login`,
          body: {
            password: user.password
          },
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Username or email is required')
        })
      })
    })
  })

  it('TC04: No puede faltar el campo contraseña', () => {
    cy.fixture('user1').then((user) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/register`,
        body: user,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.message).to.eq('User registered successfully')

        cy.request({
          method: 'POST',
          url: `${BASE_URL}/login`,
          body: {
            username: user.username,
            email: user.email
          },
          failOnStatusCode: false
        }).then((res) => {
          expect(res.status).to.eq(400)
          expect(res.body.message).to.eq('Password is required')
        })
      })
    })
  })
})
