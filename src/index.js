const express = require('express');
const projectRoutes = require('./controllers/project.controller');
const taskRoutes = require('./controllers/task.controller');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Code Quality API funcionando' });
});

app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
