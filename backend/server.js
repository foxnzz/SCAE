// ──────────────────────────────────────────────────────────
//  SCAE — Servidor Express
// ──────────────────────────────────────────────────────────
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const pool    = require('./db');
const initDb  = require('./initDb');

const app = express();

// ─── Middlewares globales ───
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error('Origin no permitido por CORS: ' + origin));
  },
}));
app.use(express.json({ limit: '1mb' }));

// ─── Servir el frontend (SCAE.html) ───
// SCAE.html vive junto a server.js para que el deploy en Railway
// (que solo copia el contenido de backend/) lo encuentre.
app.use(express.static(__dirname));
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'SCAE.html'));
});

// ─── Ping de salud ───
app.get('/api/health', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// ─── Rutas REST ───
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/empleados', require('./routes/empleados'));
app.use('/api/pensiones', require('./routes/pensiones'));
app.use('/api/registros', require('./routes/registros'));

// ─── 404 para /api/* desconocidos ───
app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint no encontrado' }));

// ─── Manejador de errores ───
app.use((err, _req, res, _next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ─── Arranque ───
const PORT = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await initDb(); // crea tablas si no existen (despliegues nuevos)
  } catch (err) {
    console.error('Error inicializando la base de datos:', err.message);
    // No abortamos: tal vez la BD aún se está levantando. El /api/health lo dirá.
  }
  app.listen(PORT, () => {
    console.log(`SCAE backend escuchando en el puerto ${PORT}`);
  });
})();
