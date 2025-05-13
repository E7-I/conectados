const BASE_URL = 'http://localhost:5001/api'

describe('Create Reviews', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5001/api/test/reset').then((response) => {
      expect(response.status).to.eq(200); // Validar que el reinicio fue exitoso
    });
  });

  it('TC01: Debe crear una review', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('review1').then((review1) => {
          cy.request({
            method: 'POST',
            url: `${BASE_URL}/users/register`,
            body: user1,
            failOnStatusCode: false
          }).then((res1) => {
            expect(res1.status).to.eq(201)

            cy.request({
              method: 'POST',
              url: `${BASE_URL}/users/register`,
              body: user2,
              failOnStatusCode: false
            }).then((res2) => {
              expect(res2.status).to.eq(201)
              cy.request({
                method: 'POST',
                url: `${BASE_URL}/reviews/createReview`,
                body: review1,
                failOnStatusCode: false
              }).then((res3) => {
                expect(res3.status).to.eq(201)
              })
            })
          })
        })
      })
    })
  })

  it('TC02: No debe crear una review con datos invalidos', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('review1').then((review1) => {
          cy.request({
            method: 'POST',
            url: `${BASE_URL}/users/register`,
            body: user1,
            failOnStatusCode: false
          }).then((res1) => {
            expect(res1.status).to.eq(201)

            cy.request({
              method: 'POST',
              url: `${BASE_URL}/users/register`,
              body: user2,
              failOnStatusCode: false
            }).then((res2) => {
              expect(res2.status).to.eq(201)
              review1.reviewerId = -1
              cy.request({
                method: 'POST',
                url: `${BASE_URL}/reviews/createReview`,
                body: review1,
                failOnStatusCode: false
              }).then((res3) => {
                expect(res3.status).to.eq(400)
              })
            })
          })
        })
      })
    })
  })

  it('TC03: El comentario no debe exeder el max de caracteres permitidos', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('review1').then((review1) => {
          cy.request({
            method: 'POST',
            url: `${BASE_URL}/users/register`,
            body: user1,
            failOnStatusCode: false
          }).then((res1) => {
            expect(res1.status).to.eq(201)

            cy.request({
              method: 'POST',
              url: `${BASE_URL}/users/register`,
              body: user2,
              failOnStatusCode: false
            }).then((res2) => {
              expect(res2.status).to.eq(201)
              review1.comment = "A".repeat(501)
              cy.request({
                method: 'POST',
                url: `${BASE_URL}/reviews/createReview`,
                body: review1,
                failOnStatusCode: false
              }).then((res3) => {
                expect(res3.status).to.eq(400)
              })
            })
          })
        })
      })
    })
  })
})

describe('Additional Review Tests', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5001/api/test/reset').then((response) => {
      expect(response.status).to.eq(200); // Validar que el reinicio fue exitoso
    });
  });

  it('TC04: No debe crear una review sin campos obligatorios', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('review1').then((review1) => {
          cy.request({
            method: 'POST',
            url: `${BASE_URL}/users/register`,
            body: user1,
            failOnStatusCode: false,
          }).then((res1) => {
            expect(res1.status).to.eq(201);

            cy.request({
              method: 'POST',
              url: `${BASE_URL}/users/register`,
              body: user2,
              failOnStatusCode: false,
            }).then((res2) => {
              expect(res2.status).to.eq(201);

              delete review1.stars;
              cy.request({
                method: 'POST',
                url: `${BASE_URL}/reviews/createReview`,
                body: review1,
                failOnStatusCode: false,
              }).then((res3) => {
                expect(res3.status).to.eq(400);
                expect(res3.body.error).to.eq('Missing required fields');
              });
            });
          });
        });
      });
    });
  });

  it('TC05: No debe crear una review con estrellas fuera del rango permitido', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('review1').then((review1) => {
          cy.request({
            method: 'POST',
            url: `${BASE_URL}/users/register`,
            body: user1,
            failOnStatusCode: false,
          }).then((res1) => {
            expect(res1.status).to.eq(201);

            cy.request({
              method: 'POST',
              url: `${BASE_URL}/users/register`,
              body: user2,
              failOnStatusCode: false,
            }).then((res2) => {
              expect(res2.status).to.eq(201);

              review1.stars = 6; // Estrellas fuera del rango permitido
              cy.request({
                method: 'POST',
                url: `${BASE_URL}/reviews/createReview`,
                body: review1,
                failOnStatusCode: false,
              }).then((res3) => {
                expect(res3.status).to.eq(400);
              });
            });
          });
        });
      });
    });
  });

  it('TC06: Debe obtener una review por ID', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('service1').then((service1) => {
          cy.fixture('appointment1').then((appointment1) => {
            cy.fixture('review1').then((review1) => {
              // Crear el servicio
              cy.request({
                method: 'POST',
                url: `${BASE_URL}/services/createService`,
                body: service1,
                failOnStatusCode: false,
              }).then((resService) => {
                expect(resService.status).to.eq(201);
  
                // Registrar el usuario profesional
                cy.request({
                  method: 'POST',
                  url: `${BASE_URL}/users/register`,
                  body: user1,
                  failOnStatusCode: false,
                }).then((res1) => {
                  expect(res1.status).to.eq(201);
  
                  // Registrar el usuario revisor
                  cy.request({
                    method: 'POST',
                    url: `${BASE_URL}/users/register`,
                    body: user2,
                    failOnStatusCode: false,
                  }).then((res2) => {
                    expect(res2.status).to.eq(201);
  
                    // Crear la reseña utilizando los datos de la cita directamente
                    review1.appointmentId = appointment1.serviceId; // Asignar el ID de la cita desde el fixture
                    cy.request({
                      method: 'POST',
                      url: `${BASE_URL}/reviews/createReview`,
                      body: review1,
                      failOnStatusCode: false,
                    }).then((res3) => {
                      expect(res3.status).to.eq(201);
  
                      // Obtener la reseña por ID
                      const reviewId = res3.body._id;
                      cy.request({
                        method: 'GET',
                        url: `${BASE_URL}/reviews/getReview/${reviewId}`,
                        failOnStatusCode: false,
                      }).then((res4) => {
                        expect(res4.status).to.eq(200);
                        expect(res4.body._id).to.eq(reviewId);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('TC07: No debe obtener una review con un ID inexistente', () => {
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/reviews/getReview/644f1b2e5f1b2c001c9d4e8c`, // ID inexistente
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.eq('Review not found');
    });
  });

  it('TC08: Debe eliminar una review existente', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('review1').then((review1) => {
          cy.request({
            method: 'POST',
            url: `${BASE_URL}/users/register`,
            body: user1,
            failOnStatusCode: false,
          }).then((res1) => {
            expect(res1.status).to.eq(201);

            cy.request({
              method: 'POST',
              url: `${BASE_URL}/users/register`,
              body: user2,
              failOnStatusCode: false,
            }).then((res2) => {
              expect(res2.status).to.eq(201);

              cy.request({
                method: 'POST',
                url: `${BASE_URL}/reviews/createReview`,
                body: review1,
                failOnStatusCode: false,
              }).then((res3) => {
                expect(res3.status).to.eq(201);

                const reviewId = res3.body._id;
                cy.request({
                  method: 'DELETE',
                  url: `${BASE_URL}/reviews/deleteReview/${reviewId}`,
                  failOnStatusCode: false,
                }).then((res4) => {
                  expect(res4.status).to.eq(200);
                  expect(res4.body.message).to.eq('Review deleted successfully');
                });
              });
            });
          });
        });
      });
    });
  });

  it('TC09: No debe eliminar una review inexistente', () => {
    cy.request({
      method: 'DELETE',
      url: `${BASE_URL}/reviews/deleteReview/644f1b2e5f1b2c001c9d4e8c`, // ID inexistente
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.eq('Review not found');
    });
  });
});

describe('Additional Review Endpoints Tests', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:5001/api/test/reset').then((response) => {
      expect(response.status).to.eq(200); // Validar que el reinicio fue exitoso
    });
  });

  it('TC10: Debe actualizar una review existente', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('review1').then((review1) => {
          // Crear usuarios y review
          cy.request('POST', `${BASE_URL}/users/register`, user1).then((res1) => {
            expect(res1.status).to.eq(201);
            cy.request('POST', `${BASE_URL}/users/register`, user2).then((res2) => {
              expect(res2.status).to.eq(201);
              cy.request('POST', `${BASE_URL}/reviews/createReview`, review1).then((res3) => {
                expect(res3.status).to.eq(201);

                // Actualizar la review
                const reviewId = res3.body._id;
                const updatedReview = { ...review1, stars: 4, comment: 'Updated comment' };
                cy.request('PUT', `${BASE_URL}/reviews/updateReview/${reviewId}`, updatedReview).then((res4) => {
                  expect(res4.status).to.eq(200);
                  expect(res4.body.stars).to.eq(4);
                  expect(res4.body.comment).to.eq('Updated comment');
                });
              });
            });
          });
        });
      });
    });
  });

  it('TC11: No debe actualizar una review con datos inválidos', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('review1').then((review1) => {
          // Crear usuarios y review
          cy.request('POST', `${BASE_URL}/users/register`, user1).then((res1) => {
            expect(res1.status).to.eq(201);
            cy.request('POST', `${BASE_URL}/users/register`, user2).then((res2) => {
              expect(res2.status).to.eq(201);
              cy.request('POST', `${BASE_URL}/reviews/createReview`, review1).then((res3) => {
                expect(res3.status).to.eq(201);
  
                // Intentar actualizar con datos inválidos
                const reviewId = res3.body._id;
                const invalidReview = { ...review1, stars: 6 }; // Estrellas fuera de rango
                cy.request({
                  method: 'PUT',
                  url: `${BASE_URL}/reviews/updateReview/${reviewId}`,
                  body: invalidReview,
                  failOnStatusCode: false,
                }).then((res4) => {
                  expect(res4.status).to.eq(400);
                  expect(res4.body.error).to.eq('Stars must be between 1 and 5'); // Cambiado al mensaje correcto
                });
              });
            });
          });
        });
      });
    });
  });

  it('TC12: No debe actualizar una review inexistente', () => {
    const invalidReviewId = '644f1b2e5f1b2c001c9d4e8c'; // ID inexistente
    const updatedReview = { stars: 4, comment: 'Updated comment' };
    cy.request({
      method: 'PUT',
      url: `${BASE_URL}/reviews/updateReview/${invalidReviewId}`,
      body: updatedReview,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.error).to.eq('Review not found');
    });
  });

  it('TC15: Debe obtener reviews por serviceId', () => {
    cy.fixture('user1').then((user1) => {
      cy.fixture('user2').then((user2) => {
        cy.fixture('service1').then((service1) => {
          cy.fixture('review1').then((review1) => {
            // Registrar al profesional
            cy.request('POST', `${BASE_URL}/users/register`, user1).then((res1) => {
              expect(res1.status).to.eq(201);
  
              // Registrar al revisor
              cy.request('POST', `${BASE_URL}/users/register`, user2).then((res2) => {
                expect(res2.status).to.eq(201);
  
                // Crear el servicio utilizando el _id del archivo service1.json
                cy.request('POST', `${BASE_URL}/services/createService`, service1).then((resService) => {
                  expect(resService.status).to.eq(201);
  
                  // Validar que el _id del archivo service1.json sea respetado
                  const serviceId = service1._id;
                  expect(resService.body._id).to.eq(serviceId);
  
                  // Actualizar los datos de la reseña con el _id del archivo
                  review1.serviceId = serviceId;
                  review1.professionalId = user1.id;
                  review1.reviewerId = user2.id;
  
                  // Crear la reseña
                  cy.request('POST', `${BASE_URL}/reviews/createReview`, review1).then((resReview) => {
                    expect(resReview.status).to.eq(201);
  
                    // Obtener reviews por serviceId
                    cy.request('GET', `${BASE_URL}/reviews/getReviewsByService/${serviceId}`).then((resReviews) => {
                      expect(resReviews.status).to.eq(200);
                      expect(resReviews.body).to.be.an('array').that.is.not.empty;
                      expect(resReviews.body[0].serviceId).to.eq(serviceId);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('TC16: No debe devolver reviews para un serviceId inexistente', () => {
    const invalidServiceId = '644f1b2e5f1b2c001c9d4e8c'; // ID inexistente
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/reviews/getReviewsByService/${invalidServiceId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });
});