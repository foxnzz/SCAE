# SCAE — Backend (Node.js + Express + MySQL)

API REST que conecta tu `SCAE.html` con una base de datos MySQL/MariaDB
y maneja autenticación con tokens JWT.

```
SCAE/
├─ SCAE.html              ← tu frontend (ahora habla con la API)
└─ backend/
   ├─ server.js           ← arranque de Express
   ├─ db.js               ← pool de conexiones MySQL
   ├─ middleware/auth.js  ← verificación de JWT
   ├─ routes/
   │   ├─ auth.js         ← /api/auth/login y /api/auth/register
   │   ├─ empleados.js    ← /api/empleados (CRUD)
   │   ├─ pensiones.js    ← /api/pensiones (CRUD)
   │   └─ registros.js    ← /api/registros (CRUD)
   ├─ schema.sql          ← script para crear la base
   ├─ package.json
   ├─ .env.example
   └─ .gitignore
```

---

## 1. Requisitos

- **Node.js 18 o superior** — comprueba con `node -v`.
- **MySQL 8** o **MariaDB 10.4+** corriendo en local *o* un servicio
  gestionado en la nube (Railway, PlanetScale, Aiven, Hostinger, etc.).

---

## 2. Configuración local (paso a paso)

1. Abre una terminal en la carpeta `backend/`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea la base de datos (si la tienes en local):
   ```bash
   mysql -u root -p < schema.sql
   ```
   Esto creará la base `scae` con las tablas `usuarios`, `empleados`,
   `pensiones` y `registros`.
4. Copia `.env.example` a `.env` y rellena tus valores reales:
   ```bash
   cp .env.example .env
   ```
   Genera un `JWT_SECRET` largo con:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
5. Arranca el servidor:
   ```bash
   npm start
   ```
6. Abre tu navegador en **http://localhost:3000** — el backend sirve el
   `SCAE.html` automáticamente y el frontend ya apunta al `/api/...`
   del mismo origen, así que no hay que tocar nada más.

> Si prefieres ver el HTML por separado (abriéndolo desde el explorador),
> el frontend usará automáticamente `http://localhost:3000/api`.

---

## 3. Flujo de uso

1. La primera vez que abres la página verás **Iniciar sesión / Crear
   cuenta**. Crea tu usuario.
2. Al hacer login el frontend guarda el token en `localStorage` y lo
   envía en cada petición como `Authorization: Bearer ...`.
3. Cada vez que agregas / editas / borras un empleado, una pensión o un
   registro, el cambio viaja al servidor y se guarda en MySQL.
4. Si cierras el navegador y vuelves a entrar, el token sigue ahí: la
   app salta el login y carga tus datos directamente.

---

## 4. Endpoints expuestos

| Método | Ruta                       | Descripción                                  |
|-------:|----------------------------|----------------------------------------------|
| POST   | `/api/auth/register`       | Crea usuario y devuelve token JWT            |
| POST   | `/api/auth/login`          | Devuelve token JWT                           |
| GET    | `/api/health`              | Ping (también prueba la conexión a la BD)    |
| GET    | `/api/empleados`           | Lista empleados                              |
| POST   | `/api/empleados`           | Crea empleado                                |
| PUT    | `/api/empleados/:id`       | Actualiza empleado                           |
| DELETE | `/api/empleados/:id`       | Elimina empleado                             |
| GET    | `/api/pensiones`           | Lista pensiones                              |
| POST   | `/api/pensiones`           | Crea pensión                                 |
| PUT    | `/api/pensiones/:id`       | Actualiza pensión                            |
| DELETE | `/api/pensiones/:id`       | Elimina pensión                              |
| GET    | `/api/registros`           | Lista registros (acepta `?year=&month=`)     |
| POST   | `/api/registros`           | Crea registro                                |
| PUT    | `/api/registros/:id`       | Actualiza registro                           |
| DELETE | `/api/registros/:id`       | Elimina registro                             |

Todas las rutas excepto `/api/auth/*` y `/api/health` requieren el
header `Authorization: Bearer <token>`.

---

## 5. Desplegar en la nube

### Opción A — Railway (la más simple)

1. Sube tu carpeta `SCAE/` a un repositorio de GitHub.
2. Entra a https://railway.app y crea un proyecto nuevo desde tu repo.
3. Añade una **base de datos MySQL** desde el panel (Add → Database →
   MySQL). Railway te dará variables como `MYSQLHOST`, `MYSQLUSER`, etc.
4. En tu servicio Node, define estas variables de entorno:
   ```
   PORT=${{PORT}}
   DB_HOST=${{MYSQL.MYSQLHOST}}
   DB_PORT=${{MYSQL.MYSQLPORT}}
   DB_USER=${{MYSQL.MYSQLUSER}}
   DB_PASSWORD=${{MYSQL.MYSQLPASSWORD}}
   DB_NAME=${{MYSQL.MYSQLDATABASE}}
   JWT_SECRET=algo-super-largo-aleatorio
   CORS_ORIGIN=*
   ```
5. Configura el **Root Directory** del servicio en `backend/` y el
   **Start Command** en `npm start` (Railway lo detecta solo).
6. Una vez desplegado, ejecuta `schema.sql` contra la base con el
   cliente MySQL que prefieras (DBeaver, TablePlus o `mysql` CLI),
   o copia el script directamente en el SQL Editor del panel.

### Opción B — Render + base externa

1. En https://render.com crea un **Web Service** desde tu repo.
2. Build: `npm install` · Start: `npm start` · Root: `backend/`.
3. Añade tu base MySQL en otro proveedor (PlanetScale, Aiven, Hostinger
   o tu propio VPS) y pon las credenciales en variables de entorno.

### Opción C — VPS propio (DigitalOcean, AWS Lightsail, etc.)

1. Instala Node 18+ y MySQL.
2. Sube los archivos por `scp` / `git pull`.
3. `npm install` dentro de `backend/`.
4. Crea un `.env` con tus credenciales reales.
5. Usa **PM2** para mantenerlo vivo:
   ```bash
   npm install -g pm2
   pm2 start server.js --name scae
   pm2 save
   pm2 startup
   ```
6. Pon Nginx delante para HTTPS (Let's Encrypt + `certbot`) y para
   servir el archivo `SCAE.html` desde el mismo dominio.

---

## 6. Seguridad — recomendaciones mínimas

- **Cambia siempre `JWT_SECRET`** antes de subir a producción.
- Pon `CORS_ORIGIN` apuntando solo a tu dominio real (no `*`).
- Forzá HTTPS en producción.
- Haz backup de tu base de datos al menos una vez al día.

---

## 7. Resolución de problemas

- **`ECONNREFUSED 127.0.0.1:3306`** → MySQL no está corriendo o el host
  no es correcto.
- **`ER_ACCESS_DENIED_ERROR`** → usuario/contraseña de MySQL incorrectos.
- **`Sesión expirada` en el navegador** → tu token caducó (por defecto
  7 días) o cambiaste el `JWT_SECRET`. Vuelve a iniciar sesión.
- **CORS bloqueado** → ajusta `CORS_ORIGIN` en `.env` con el dominio
  exacto desde el que se sirve el HTML.
