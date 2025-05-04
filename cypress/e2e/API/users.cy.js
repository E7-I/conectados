const BASE_URL = 'http://localhost:5001/api/users'

describe('Users CRUD', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5001/api/test/reset')
  })

  // TC01: Registro de un nuevo usuario
  it('should create a new user', () => {
    cy.fixture('user1').then((user) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/register`,
        body: user,
        failOnStatusCode: false // previene que cypress falle si el status es 4xx o 5xx
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.user.username).to.eq(user.username)
      })
    })
  })

  // TC02: Registro de un usuario existente
  it('should not create a user that already exists', () => {
    cy.fixture('user1').then((user) => {
      // se crea un usuario
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/register`,
        body: user,
        failOnStatusCode: false
      }).then((res1) => {
        expect(res1.status).to.eq(201)

        // se intenta crear el mismo usuario nuevamente
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
})
