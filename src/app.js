const express = require('express');
const projectRoutes = require('./controllers/project.controller');
const taskRoutes = require('./controllers/task.controller');

const createApp = (configureRoutes) => {
  const app = express();

  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ message: 'Code Quality API funcionando' });
  });

  app.use('/projects', projectRoutes);
  app.use('/tasks', taskRoutes);

  if (typeof configureRoutes === 'function') {
    configureRoutes(app);
  }

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
};

module.exports = { createApp };

