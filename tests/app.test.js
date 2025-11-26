const request = require('supertest');
const { createApp } = require('../src/app');

describe('App general', () => {
  test('GET / debe responder con mensaje de estado', async () => {
    const app = createApp();

    const response = await request(app).get('/').expect(200);

    expect(response.body).toEqual({ message: 'Code Quality API funcionando' });
  });

  test('middleware global maneja errores', async () => {
    const app = createApp((instance) => {
      instance.get('/force-error', () => {
        throw new Error('Boom');
      });
    });

    const response = await request(app).get('/force-error').expect(500);

    expect(response.body.error).toBe('Error interno del servidor');
  });
});

