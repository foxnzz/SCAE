-- ============================================================
--  SCAE — Esquema de base de datos (MySQL / MariaDB)
--  Ejecuta este archivo una sola vez sobre tu servidor MySQL:
--      mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS scae
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE scae;

-- ─────────────────────────────────────────────
-- Usuarios del sistema (login / registro)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(80)  NOT NULL,
  apellido        VARCHAR(80)  DEFAULT NULL,
  usuario         VARCHAR(60)  NOT NULL UNIQUE,
  email           VARCHAR(120) DEFAULT NULL,
  telefono        VARCHAR(40)  DEFAULT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- Empleados (tarjetas + tabla en la sección Empleados)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS empleados (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  ingreso     DATE         DEFAULT NULL,
  dias        VARCHAR(120) DEFAULT NULL,
  estatus     ENUM('Activo','Inactivo') DEFAULT 'Activo',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- Pensiones (autos / camionetas / motos)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pensiones (
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
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- Registros / reportes diarios (talonarios + gastos + sueldo)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS registros (
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
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- (Opcional) Datos de ejemplo — bórralos si no los quieres
-- ─────────────────────────────────────────────
INSERT INTO empleados (nombre, ingreso, dias, estatus) VALUES
  ('Nick G',        '2023-04-03', 'Martes | Jueves',   'Activo'),
  ('Jesus G',       '2024-01-07', 'Lunes – Viernes',   'Activo'),
  ('Gabriel Lopez', '2025-12-15', 'Sábado | Domingo',  'Activo'),
  ('Leo Antonio',   '2021-07-23', 'Viernes',           'Activo');

INSERT INTO pensiones (nombre, placas, tipo, tel, inicio, cuota, notas, estatus) VALUES
  ('Carlos Méndez',   'ABC-123-D', 'Automóvil',  '55 1234 5678', '2026-01-15',  800, 'Rojo, Honda Civic', 'Activa'),
  ('Laura Rodríguez', 'XYZ-789-K', 'Camioneta',  '55 9876 5432', '2025-11-01', 1000, 'Blanca, RAM 1500',  'Activa'),
  ('Miguel Torres',   'MNO-456-P', 'Motocicleta', NULL,          '2026-03-10',  400, 'Yamaha negra',      'Activa');
