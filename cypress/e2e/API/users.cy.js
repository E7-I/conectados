const BASE_URL = 'http://localhost:5001/api/users'

describe("Users CRUD", () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5001/api/test/reset')
  })

  // TC01: Registro de un nuevo usuario
  it('should create a new user', () => {
    cy.request({
      method: 'POST',
      url: `${BASE_URL}/register`,
      body: {
        id: 14298637,
        username: 'juanperez',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'secreta123',
      },
      failOnStatusCode: false // previene que cypress falle si el status es 4xx o 5xx
    })
    .then((res) => {
      expect(res.status).to.eq(201)
    })
  })
})
