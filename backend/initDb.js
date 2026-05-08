// ──────────────────────────────────────────────────────────
//  Inicialización automática de la base de datos
//  Crea las tablas si no existen al arrancar el servidor.
//  Útil para despliegues nuevos (Railway, Render, etc.).
// ──────────────────────────────────────────────────────────
const pool = require('./db');

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS usuarios (
     id              INT AUTO_INCREMENT PRIMARY KEY,
     nombre          VARCHAR(80)  NOT NULL,
     apellido        VARCHAR(80)  DEFAULT NULL,
     usuario         VARCHAR(60)  NOT NULL UNIQUE,
     email           VARCHAR(120) DEFAULT NULL,
     telefono        VARCHAR(40)  DEFAULT NULL,
     password_hash   VARCHAR(255) NOT NULL,
     created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
   ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS empleados (
     id          INT AUTO_INCREMENT PRIMARY KEY,
     nombre      VARCHAR(120) NOT NULL,
     ingreso     DATE         DEFAULT NULL,
     dias        VARCHAR(120) DEFAULT NULL,
     estatus     ENUM('Activo','Inactivo') DEFAULT 'Activo',
     created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
   ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS pensiones (
     id          INT AUTO_INCREMENT PRIMARY KEY,
     nombre      VARCHAR(120) NOT NULL,
     placas      VARCHAR(20)  NOT NULL,
     tipo        VARCHAR(40)  DEFAULT 'Automóvil',
     tel         VARCHAR(40)  DEFAULT NULL,
     inicio      DATE         DEFAULT NULL,
     cuota       DECIMAL(10,2) DEFAULT 0,
     notas       VARCHAR(255) DEFAULT NULL,
     estatus     ENUM('Activa','Inactiva') DEFAULT 'Activa',
     created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
   ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS registros (
     id          INT AUTO_INCREMENT PRIMARY KEY,
     fecha       DATE         NOT NULL,
     empleado    VARCHAR(120) NOT NULL,
     ini         INT          DEFAULT 0,
     fin         INT          DEFAULT 0,
     total       DECIMAL(10,2) DEFAULT 0,
     gastos      DECIMAL(10,2) DEFAULT 0,
     sueldo      DECIMAL(10,2) DEFAULT 0,
     created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_registros_fecha (fecha)
   ) ENGINE=InnoDB`,
];

async function initDb() {
  for (const sql of STATEMENTS) {
    await pool.query(sql);
  }
  console.log('✓ Tablas verificadas / creadas correctamente');
}

module.exports = initDb;
