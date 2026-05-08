// ──────────────────────────────────────────────────────────
//  Pool de conexiones a MySQL (mysql2/promise)
//  Acepta tanto nuestros nombres locales (DB_*) como los que
//  Railway expone automáticamente (MYSQL*) o una URL completa.
// ──────────────────────────────────────────────────────────
const mysql = require('mysql2/promise');

const env = process.env;

// 1) Si nos dieron una URL completa (Railway, PlanetScale, etc.), la usamos.
const url = env.DATABASE_URL || env.MYSQL_URL;
let config;

if (url) {
  config = url; // mysql2 acepta directamente la cadena de conexión
} else {
  // 2) Variables individuales — primero las nuestras (DB_*), luego las de Railway.
  config = {
    host:     env.DB_HOST     || env.MYSQLHOST     || env.MYSQL_HOST     || 'localhost',
    port:     Number(env.DB_PORT || env.MYSQLPORT  || env.MYSQL_PORT     || 3306),
    user:     env.DB_USER     || env.MYSQLUSER     || env.MYSQL_USER     || 'root',
    password: env.DB_PASSWORD || env.MYSQLPASSWORD || env.MYSQL_PASSWORD || '',
    database: env.DB_NAME     || env.MYSQLDATABASE || env.MYSQL_DATABASE || 'scae',
  };
}

// Opciones comunes (se aplican aunque hayamos usado URL).
const commonOptions = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  dateStrings: true,     // Devuelve fechas como 'YYYY-MM-DD' en vez de Date
  decimalNumbers: true,  // Devuelve DECIMAL como Number (importante para sumas)
};

const pool = (typeof config === 'string')
  ? mysql.createPool(Object.assign({ uri: config }, commonOptions))
  : mysql.createPool(Object.assign({}, config, commonOptions));

module.exports = pool;
