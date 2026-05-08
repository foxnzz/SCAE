# SCAE — Sistema de Control de Asistencias

Aplicación web para llevar control de asistencias, talonarios, pensiones
de estacionamiento y empleados. Frontend en HTML/JS puro y backend en
Node.js + Express con base de datos MySQL.

## Estructura

```
SCAE/
├─ SCAE.html      ← interfaz (se sirve desde el backend)
└─ backend/       ← API REST + autenticación JWT
   └─ README.md   ← instrucciones detalladas
```

## Correr en local

```bash
cd backend
npm install
cp .env.example .env       # rellena credenciales reales
npm start
```

Abre http://localhost:3000

## Despliegue en Railway

Ver `backend/README.md` o sigue la guía rápida que se incluye en el
chat del proyecto.
