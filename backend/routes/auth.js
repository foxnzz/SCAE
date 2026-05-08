// ──────────────────────────────────────────────────────────
//  Rutas de autenticación: registro y login
// ──────────────────────────────────────────────────────────
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../db');

const router = express.Router();

// ─── POST /api/auth/register ─────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, usuario, email, telefono, password } = req.body || {};

    if (!nombre || !usuario || !password) {
      return res.status(400).json({ error: 'nombre, usuario y password son obligatorios' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const [dup] = await pool.query('SELECT id FROM usuarios WHERE usuario = ? LIMIT 1', [usuario]);
    if (dup.length) {
      return res.status(409).json({ error: 'Ese nombre de usuario ya está en uso' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, usuario, email, telefono, password_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido || null, usuario, email || null, telefono || null, hash],
    );

    const token = jwt.sign(
      { id: result.insertId, usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );

    res.status(201).json({
      token,
      usuario: { id: result.insertId, nombre, apellido, usuario, email },
    });
  } catch (err) {
    console.error('register:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ─── POST /api/auth/login ────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body || {};
    if (!usuario || !password) {
      return res.status(400).json({ error: 'usuario y password son obligatorios' });
    }

    const [rows] = await pool.query(
      'SELECT id, nombre, apellido, usuario, email, password_hash FROM usuarios WHERE usuario = ? LIMIT 1',
      [usuario],
    );
    if (!rows.length) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );

    res.json({
      token,
      usuario: {
        id: user.id, nombre: user.nombre, apellido: user.apellido,
        usuario: user.usuario, email: user.email,
      },
    });
  } catch (err) {
    console.error('login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
