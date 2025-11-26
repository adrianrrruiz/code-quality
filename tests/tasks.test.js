const request = require('supertest');
const express = require('express');
const taskRoutes = require('../src/controllers/task.controller');
const projectRoutes = require('../src/controllers/project.controller');
const db = require('../src/db/db');

const app = express();
app.use(express.json());
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

describe('Task Routes', () => {
  let projectId;

  beforeEach(async () => {
    // Limpiar y recrear tablas antes de cada test
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('PRAGMA foreign_keys = ON');
        db.run('DELETE FROM tasks', (err) => {
          if (err) return reject(err);
          db.run('DELETE FROM projects', (err2) => {
            if (err2) return reject(err2);
            resolve();
          });
        });
      });
    });

    // Crear un proyecto a través de la API para obtener un ID válido
    const response = await request(app)
      .post('/projects')
      .send({ name: 'Proyecto Test', description: 'Descripción de prueba' })
      .expect(201);

    projectId = response.body.id;
  });

  // Nota: No cerramos la base de datos aquí porque es un singleton compartido

  describe('POST /projects/:id/tasks', () => {
    test('debería crear una tarea exitosamente', async () => {
      const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'Tarea Test', status: 'PENDING' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Tarea Test');
      expect(response.body.status).toBe('PENDING');
      expect(response.body.projectId).toBe(projectId);
    });

    test('debería usar PENDING como estado por defecto', async () => {
      const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'Tarea Sin Estado' })
        .expect(201);

      expect(response.body.status).toBe('PENDING');
    });

    test('debería retornar error 400 si falta el título', async () => {
      const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ status: 'PENDING' })
        .expect(400);

      expect(response.body.error).toBe('title es obligatorio');
    });
  });

  describe('GET /tasks', () => {
    test('debería listar todas las tareas', async () => {
      // Crear una tarea primero
      await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'Tarea 1' });

      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /tasks/:id', () => {
    test('debería obtener una tarea específica', async () => {
      // Crear una tarea
      const createResponse = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'Tarea Test' });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .get(`/tasks/${taskId}`)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe('Tarea Test');
    });

    test('debería retornar 404 si la tarea no existe', async () => {
      const response = await request(app)
        .get('/tasks/999')
        .expect(404);

      expect(response.body.error).toBe('Tarea no encontrada');
    });
  });

  describe('PUT /tasks/:id', () => {
    test('debería actualizar una tarea exitosamente', async () => {
      // Crear una tarea
      const createResponse = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'Tarea Original', status: 'PENDING' });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ title: 'Tarea Actualizada', status: 'COMPLETED' })
        .expect(200);

      expect(response.body.title).toBe('Tarea Actualizada');
      expect(response.body.status).toBe('COMPLETED');
    });

    test('debería retornar 404 si la tarea no existe', async () => {
      const response = await request(app)
        .put('/tasks/999')
        .send({ title: 'Actualizada', status: 'COMPLETED' })
        .expect(404);

      expect(response.body.error).toBe('Tarea no encontrada');
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('debería eliminar una tarea exitosamente', async () => {
      // Crear una tarea
      const createResponse = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'Tarea a Eliminar' });

      const taskId = createResponse.body.id;

      await request(app)
        .delete(`/tasks/${taskId}`)
        .expect(204);
    });

    test('debería retornar 404 si la tarea no existe', async () => {
      const response = await request(app)
        .delete('/tasks/999')
        .expect(404);

      expect(response.body.error).toBe('Tarea no encontrada');
    });
  });

  describe('GET /projects/:id/tasks', () => {
    test('debería listar las tareas de un proyecto', async () => {
      // Crear tareas para el proyecto
      await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'Tarea 1' });

      await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'Tarea 2' });

      const response = await request(app)
        .get(`/projects/${projectId}/tasks`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });
});

