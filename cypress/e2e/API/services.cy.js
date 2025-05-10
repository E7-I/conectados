const BASE_URL = 'http://localhost:5001/api/services';

describe('Services API Tests', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5001/api/test/reset').then((response) => {
      expect(response.status).to.eq(200); // Validar que el reinicio fue exitoso
    });
  });

  it('TC01: Debe crear un nuevo servicio', () => {
    cy.fixture('service1').then((service) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/createService`,
        body: service,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.title).to.eq(service.title);
      });
    });
  });

  it('TC02: No debe crear un servicio con datos faltantes', () => {
    cy.fixture('service1').then((service) => {
      delete service.title; // Eliminar un campo obligatorio
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/createService`,
        body: service,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq('Missing required fields');
      });
    });
  });

  it('TC03: Debe obtener un servicio por ID', () => {
    cy.fixture('service1').then((service) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/createService`,
        body: service,
        failOnStatusCode: false,
      }).then((res) => {
        const serviceId = res.body._id;
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/getService/${serviceId}`,
          failOnStatusCode: false,
        }).then((res2) => {
          expect(res2.status).to.eq(200);
          expect(res2.body._id).to.eq(serviceId);
        });
      });
    });
  });

  it('TC04: No debe obtener un servicio con un ID inexistente', () => {
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/getService/644f1b2e5f1b2c001c9d4e8c`, // ID inexistente
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.eq('Service not found');
    });
  });

  it('TC05: Debe obtener servicios por professionalId', () => {
    cy.fixture('service1').then((service) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/createService`,
        body: service,
        failOnStatusCode: false,
      }).then((res) => {
        const professionalId = service.professionalid;
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/getServicesProfessionalId/${professionalId}`,
          failOnStatusCode: false,
        }).then((res2) => {
          expect(res2.status).to.eq(200);
          expect(res2.body).to.be.an('array').that.is.not.empty;
          expect(res2.body[0].professionalid).to.eq(professionalId);
        });
      });
    });
  });

  it('TC06: No debe devolver servicios para un professionalId inexistente', () => {
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/getServicesProfessionalId/9999`, // professionalId inexistente
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.eq('No services found for this professional');
    });
  });

  it('TC07: Debe obtener todos los servicios', () => {
    cy.fixture('service1').then((service) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/createService`,
        body: service,
        failOnStatusCode: false,
      }).then(() => {
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/getAllServices`,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.be.an('array').that.is.not.empty;
        });
      });
    });
  });

  it('TC08: Debe actualizar un servicio existente', () => {
    cy.fixture('service1').then((service) => {
        cy.request({
            method: 'POST',
            url: `${BASE_URL}/createService`,
            body: service,
            failOnStatusCode: false,
        }).then((res) => {
            const serviceId = res.body._id;
            const updatedService = { ...service, title: 'Updated Title' }; // Datos válidos
            cy.request({
                method: 'PUT',
                url: `${BASE_URL}/updateService/${serviceId}`,
                body: updatedService,
                failOnStatusCode: false,
            }).then((res2) => {
                expect(res2.status).to.eq(200);
                expect(res2.body.title).to.eq('Updated Title');
            });
        });
    });
});

  it('TC09: No debe actualizar un servicio inexistente', () => {
    cy.request({
      method: 'PUT',
      url: `${BASE_URL}/updateService/644f1b2e5f1b2c001c9d4e8c`, // ID inexistente
      body: { title: 'Updated Title' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.eq('Service not found');
    });
  });

  it('TC10: Debe agregar una calificación a un servicio', () => {
    cy.fixture('service1').then((service) => {
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/createService`,
        body: service,
        failOnStatusCode: false,
      }).then((res) => {
        const serviceId = res.body._id;
        cy.request({
          method: 'PUT',
          url: `${BASE_URL}/addRating/${serviceId}`,
          body: { rating: 5 },
          failOnStatusCode: false,
        }).then((res2) => {
          expect(res2.status).to.eq(200);
          expect(res2.body.averageRating).to.eq(5);
        });
      });
    });
  });

  it('TC11: No debe agregar una calificación a un servicio inexistente', () => {
    cy.request({
      method: 'PUT',
      url: `${BASE_URL}/addRating/644f1b2e5f1b2c001c9d4e8c`, // ID inexistente
      body: { rating: 5 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.eq('Service not found');
    });
  });

  it('TC12: Debe filtrar servicios por criterios', () => {
    cy.fixture('service1').then((service) => {
      // Asegúrate de que el servicio cumple con los criterios de filtrado
      service.categories = ['Belleza'];
      service.price = { min: 10, max: 100 };
  
      cy.request({
        method: 'POST',
        url: `${BASE_URL}/createService`,
        body: service,
        failOnStatusCode: false,
      }).then(() => {
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/getFilteredServices?minPrice=10&maxPrice=100&category=Belleza`,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.be.an('array').that.is.not.empty;
          expect(res.body[0].categories).to.include('Belleza');
          expect(res.body[0].price.min).to.be.at.least(10);
          expect(res.body[0].price.max).to.be.at.most(100);
        });
      });
    });
  });
});