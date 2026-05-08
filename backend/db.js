// ──────────────────────────────────────────────────────────
//  Pool de conexiones a MySQL (mysql2/promise)
// ──────────────────────────────────────────────────────────
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'scae',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Para hostings que requieren SSL (PlanetScale, Aiven, algunos de Railway).
  // Pon DB_SSL=true en tus variables de entorno si lo necesitas.
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  dateStrings: true,     // Devuelve fechas como 'YYYY-MM-DD' en vez de Date
  decimalNumbers: true,  // Devuelve DECIMAL como Number en vez de String (importante para sumas)
});

module.exports = pool;
