const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', '..', 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  }
  console.log('Conectado a la base de datos SQLite.');
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
      console.error('Error al configurar foreign keys:', err.message);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear tabla projects:', err.message);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear tabla tasks:', err.message);
    } else {
      console.log('Tablas inicializadas correctamente.');
    }
  });
});

// Manejar errores de la base de datos
db.on('error', (err) => {
  console.error('Error en la base de datos:', err.message);
});

module.exports = db;
