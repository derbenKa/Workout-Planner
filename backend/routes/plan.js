const express = require('express');
const router = express.Router();
const db = require('../db');

const DAYS = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];

router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT p.*, e.name, e.muscle_group, e.image_path, e.notes
    FROM plan p JOIN exercises e ON p.exercise_id = e.id
    ORDER BY p.day, p.sort_order
  `).all();
  const plan = {};
  DAYS.forEach(d => plan[d] = []);
  rows.forEach(r => {
    if (plan[r.day]) plan[r.day].push(r);
  });
  res.json(plan);
});

router.post('/', (req, res) => {
  const { day, exercise_id, sets, reps } = req.body;
  if (!day || !exercise_id) return res.status(400).json({ error: 'day and exercise_id required' });
  const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM plan WHERE day=?').get(day);
  const sort_order = (maxOrder?.m ?? -1) + 1;
  const result = db.prepare(
    'INSERT INTO plan (day, exercise_id, sets, reps, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).run(day, exercise_id, sets || 3, reps || '10', sort_order);
  res.json({ id: result.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { sets, reps } = req.body;
  db.prepare('UPDATE plan SET sets=?, reps=? WHERE id=?').run(sets, reps, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM plan WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
