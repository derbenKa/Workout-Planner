const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM exercises ORDER BY name').all();
  res.json(rows);
});

router.post('/', upload.single('image'), (req, res) => {
  const { name, muscle_group, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;
  const result = db.prepare(
    'INSERT INTO exercises (name, muscle_group, image_path, notes) VALUES (?, ?, ?, ?)'
  ).run(name, muscle_group || null, image_path, notes || null);
  res.json({ id: result.lastInsertRowid, name, muscle_group, image_path, notes });
});

router.put('/:id', upload.single('image'), (req, res) => {
  const { name, muscle_group, notes } = req.body;
  const existing = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'not found' });
  const image_path = req.file ? `/uploads/${req.file.filename}` : existing.image_path;
  db.prepare(
    'UPDATE exercises SET name=?, muscle_group=?, image_path=?, notes=? WHERE id=?'
  ).run(name || existing.name, muscle_group ?? existing.muscle_group, image_path, notes ?? existing.notes, req.params.id);
  res.json({ id: Number(req.params.id), name, muscle_group, image_path, notes });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM exercises WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
