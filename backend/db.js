const Database = require('better-sqlite3');
const path = require('path');

const dbDir = process.env.DB_DIR || __dirname;
const db = new Database(path.join(dbDir, 'workout.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    muscle_group TEXT,
    image_path TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets INTEGER DEFAULT 3,
    reps TEXT DEFAULT '10',
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
  );
`);

module.exports = db;
