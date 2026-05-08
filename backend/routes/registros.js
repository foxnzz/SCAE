// ──────────────────────────────────────────────────────────
//  CRUD de registros (reportes diarios con talonarios)
// ──────────────────────────────────────────────────────────
const express = require('express');
const pool    = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

// GET /api/registros  (acepta ?year=YYYY&month=MM)
router.get('/', async (req, res) => {
  try {
    const { year, month } = req.query;
    let sql = 'SELECT id, fecha, empleado, ini, fin, total, gastos, sueldo FROM registros';
    const params = [];

    if (year && month) {
      sql += ' WHERE YEAR(fecha)=? AND MONTH(fecha)=?';
      params.push(Number(year), Number(month));
    } else if (year) {
      sql += ' WHERE YEAR(fecha)=?';
      params.push(Number(year));
    }
    sql += ' ORDER BY fecha DESC, id DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('list registros:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/registros
router.post('/', async (req, res) => {
  try {
    const { fecha, empleado, ini, fin, total, gastos, sueldo } = req.body || {};
    if (!fecha || !empleado) {
      return res.status(400).json({ error: 'fecha y empleado son obligatorios' });
    }
    const [result] = await pool.query(
      `INSERT INTO registros (fecha, empleado, ini, fin, total, gastos, sueldo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fecha, empleado, Number(ini) || 0, Number(fin) || 0,
       Number(total) || 0, Number(gastos) || 0, Number(sueldo) || 0],
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error('create registro:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// PUT /api/registros/:id
router.put('/:id', async (req, res) => {
  try {
    const { fecha, empleado, ini, fin, total, gastos, sueldo } = req.body || {};
    if (!fecha || !empleado) {
      return res.status(400).json({ error: 'fecha y empleado son obligatorios' });
    }
    const [result] = await pool.query(
      `UPDATE registros SET fecha=?, empleado=?, ini=?, fin=?, total=?, gastos=?, sueldo=?
        WHERE id=?`,
      [fecha, empleado, Number(ini) || 0, Number(fin) || 0,
       Number(total) || 0, Number(gastos) || 0, Number(sueldo) || 0, req.params.id],
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json({ id: Number(req.params.id), ...req.body });
  } catch (err) {
    console.error('update registro:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// DELETE /api/registros/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM registros WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    console.error('delete registro:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
