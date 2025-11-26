const express = require('express');
const db = require('../db/db');

const router = express.Router();

// GET /projects - listar todos los proyectos
router.get('/', (req, res) => {
  db.all('SELECT * FROM projects', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener proyectos' });
    res.json(rows);
  });
});

// GET /projects/:id - obtener un proyecto
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener proyecto' });
    if (!row) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(row);
  });
});

// POST /projects - crear proyecto
router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name es obligatorio' });

  db.run(
    'INSERT INTO projects (name, description) VALUES (?, ?)',
    [name, description || null],
    function (err) {
      if (err) return res.status(500).json({ error: 'Error al crear proyecto' });
      res.status(201).json({ id: this.lastID, name, description: description || null });
    }
  );
});

// PUT /projects/:id - actualizar proyecto
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  db.run(
    'UPDATE projects SET name = ?, description = ? WHERE id = ?',
    [name, description || null, id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Error al actualizar proyecto' });
      if (this.changes === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
      res.json({ id: Number(id), name, description: description || null });
    }
  );
});

// DELETE /projects/:id - eliminar proyecto
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar proyecto' });
    if (this.changes === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(204).send();
  });
});

// GET /projects/:id/tasks - listar tareas de un proyecto
router.get('/:id/tasks', (req, res) => {
  const { id } = req.params;

  db.all('SELECT * FROM tasks WHERE projectId = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener tareas' });
    res.json(rows);
  });
});

// POST /projects/:id/tasks - crear tarea en un proyecto
router.post('/:id/tasks', (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  if (!title) return res.status(400).json({ error: 'title es obligatorio' });

  const finalStatus = status || 'PENDING';

  // Verificar que el proyecto existe antes de crear la tarea
  db.get('SELECT id FROM projects WHERE id = ?', [id], (err, project) => {
    if (err) return res.status(500).json({ error: 'Error al verificar proyecto' });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Habilitar foreign keys antes de insertar
    db.run('PRAGMA foreign_keys = ON', () => {
      db.run(
        'INSERT INTO tasks (projectId, title, status) VALUES (?, ?, ?)',
        [id, title, finalStatus],
        function (insertErr) {
          if (insertErr) {
            console.error('Error al crear tarea:', insertErr);
            return res.status(500).json({ error: 'Error al crear tarea' });
          }
          res
            .status(201)
            .json({ id: this.lastID, projectId: Number(id), title, status: finalStatus });
        }
      );
    });
  });
});

module.exports = router;
