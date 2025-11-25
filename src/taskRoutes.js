const express = require('express');
const db = require('./db');

const router = express.Router();

// GET /tasks/:id - obtener tarea
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener tarea' });
    if (!row) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(row);
  });
});

// PUT /tasks/:id - actualizar tarea
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  db.run(
    'UPDATE tasks SET title = ?, status = ? WHERE id = ?',
    [title, status, id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Error al actualizar tarea' });
      if (this.changes === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.json({ id: Number(id), title, status });
    }
  );
});

// DELETE /tasks/:id - eliminar tarea
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar tarea' });
    if (this.changes === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.status(204).send();
  });
});

module.exports = router;
