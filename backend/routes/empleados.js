// ──────────────────────────────────────────────────────────
//  CRUD de empleados
// ──────────────────────────────────────────────────────────
const express = require('express');
const pool    = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

// GET /api/empleados
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, ingreso, dias, estatus FROM empleados ORDER BY id ASC',
    );
    res.json(rows);
  } catch (err) {
    console.error('list empleados:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/empleados
router.post('/', async (req, res) => {
  try {
    const { nombre, ingreso, dias, estatus } = req.body || {};
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    const [result] = await pool.query(
      'INSERT INTO empleados (nombre, ingreso, dias, estatus) VALUES (?, ?, ?, ?)',
      [nombre, ingreso || null, dias || null, estatus || 'Activo'],
    );
    res.status(201).json({ id: result.insertId, nombre, ingreso, dias, estatus: estatus || 'Activo' });
  } catch (err) {
    console.error('create empleado:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// PUT /api/empleados/:id
router.put('/:id', async (req, res) => {
  try {
    const { nombre, ingreso, dias, estatus } = req.body || {};
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    const [result] = await pool.query(
      'UPDATE empleados SET nombre=?, ingreso=?, dias=?, estatus=? WHERE id=?',
      [nombre, ingreso || null, dias || null, estatus || 'Activo', req.params.id],
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ id: Number(req.params.id), nombre, ingreso, dias, estatus: estatus || 'Activo' });
  } catch (err) {
    console.error('update empleado:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// DELETE /api/empleados/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM empleados WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    console.error('delete empleado:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
