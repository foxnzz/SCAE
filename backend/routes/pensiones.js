// ──────────────────────────────────────────────────────────
//  CRUD de pensiones (autos / camionetas / motos)
// ──────────────────────────────────────────────────────────
const express = require('express');
const pool    = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

// GET /api/pensiones
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, placas, tipo, tel, inicio, cuota, notas, estatus
         FROM pensiones ORDER BY id ASC`,
    );
    res.json(rows);
  } catch (err) {
    console.error('list pensiones:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/pensiones
router.post('/', async (req, res) => {
  try {
    const { nombre, placas, tipo, tel, inicio, cuota, notas, estatus } = req.body || {};
    if (!nombre || !placas) {
      return res.status(400).json({ error: 'nombre y placas son obligatorios' });
    }
    const [result] = await pool.query(
      `INSERT INTO pensiones (nombre, placas, tipo, tel, inicio, cuota, notas, estatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, placas, tipo || 'Automóvil', tel || null, inicio || null,
       Number(cuota) || 0, notas || null, estatus || 'Activa'],
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error('create pension:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// PUT /api/pensiones/:id
router.put('/:id', async (req, res) => {
  try {
    const { nombre, placas, tipo, tel, inicio, cuota, notas, estatus } = req.body || {};
    if (!nombre || !placas) {
      return res.status(400).json({ error: 'nombre y placas son obligatorios' });
    }
    const [result] = await pool.query(
      `UPDATE pensiones SET nombre=?, placas=?, tipo=?, tel=?, inicio=?, cuota=?, notas=?, estatus=?
        WHERE id=?`,
      [nombre, placas, tipo || 'Automóvil', tel || null, inicio || null,
       Number(cuota) || 0, notas || null, estatus || 'Activa', req.params.id],
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Pensión no encontrada' });
    res.json({ id: Number(req.params.id), ...req.body });
  } catch (err) {
    console.error('update pension:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// DELETE /api/pensiones/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM pensiones WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Pensión no encontrada' });
    res.json({ ok: true });
  } catch (err) {
    console.error('delete pension:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
