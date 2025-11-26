const request = require('supertest');
const express = require('express');
const projectRoutes = require('../src/controllers/project.controller');
const db = require('../src/db/db');

const app = express();
app.use(express.json());
app.use('/projects', projectRoutes);

describe('Project Routes', () => {
  beforeEach((done) => {
    // Limpiar y recrear tablas antes de cada test
    db.serialize(() => {
      db.run('DELETE FROM tasks', () => {
        db.run('DELETE FROM projects', () => {
          done();
        });
      });
    });
  });

  // Nota: No cerramos la base de datos aquí porque es un singleton compartido

  describe('POST /projects', () => {
    test('debería crear un proyecto exitosamente', async () => {
      const response = await request(app)
        .post('/projects')
        .send({ name: 'Proyecto Test', description: 'Descripción de prueba' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Proyecto Test');
      expect(response.body.description).toBe('Descripción de prueba');
    });

    test('debería retornar error 400 si falta el nombre', async () => {
      const response = await request(app)
        .post('/projects')
        .send({ description: 'Sin nombre' })
        .expect(400);

      expect(response.body.error).toBe('name es obligatorio');
    });
  });

  describe('GET /projects', () => {
    test('debería listar todos los proyectos', async () => {
      // Crear un proyecto primero
      await request(app)
        .post('/projects')
        .send({ name: 'Proyecto 1' });

      const response = await request(app)
        .get('/projects')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /projects/:id', () => {
    test('debería obtener un proyecto específico', async () => {
      // Crear un proyecto
      const createResponse = await request(app)
        .post('/projects')
        .send({ name: 'Proyecto Test' });

      const projectId = createResponse.body.id;

      const response = await request(app)
        .get(`/projects/${projectId}`)
        .expect(200);

      expect(response.body.id).toBe(projectId);
      expect(response.body.name).toBe('Proyecto Test');
    });

    test('debería retornar 404 si el proyecto no existe', async () => {
      const response = await request(app)
        .get('/projects/999')
        .expect(404);

      expect(response.body.error).toBe('Proyecto no encontrado');
    });
  });

  describe('PUT /projects/:id', () => {
    test('debería actualizar un proyecto exitosamente', async () => {
      // Crear un proyecto
      const createResponse = await request(app)
        .post('/projects')
        .send({ name: 'Proyecto Original' });

      const projectId = createResponse.body.id;

      const response = await request(app)
        .put(`/projects/${projectId}`)
        .send({ name: 'Proyecto Actualizado', description: 'Nueva descripción' })
        .expect(200);

      expect(response.body.name).toBe('Proyecto Actualizado');
      expect(response.body.description).toBe('Nueva descripción');
    });

    test('debería retornar 404 si el proyecto no existe', async () => {
      const response = await request(app)
        .put('/projects/999')
        .send({ name: 'Actualizado' })
        .expect(404);

      expect(response.body.error).toBe('Proyecto no encontrado');
    });
  });

  describe('DELETE /projects/:id', () => {
    test('debería eliminar un proyecto exitosamente', async () => {
      // Crear un proyecto
      const createResponse = await request(app)
        .post('/projects')
        .send({ name: 'Proyecto a Eliminar' });

      const projectId = createResponse.body.id;

      await request(app)
        .delete(`/projects/${projectId}`)
        .expect(204);
    });

    test('debería retornar 404 si el proyecto no existe', async () => {
      const response = await request(app)
        .delete('/projects/999')
        .expect(404);

      expect(response.body.error).toBe('Proyecto no encontrado');
    });
  });
});

