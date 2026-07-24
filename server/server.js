require('dotenv').config();
const express = require('express');
const path = require('path');

const produccionRoutes = require('./routes/produccion');
const empleadosRoutes = require('./routes/empleados');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');

app.use(express.json());

// Evita exponer el código del servidor y archivos ocultos (.env, etc.)
app.use('/server', (req, res) => res.status(403).end());
app.use(express.static(ROOT_DIR, { dotfiles: 'deny', index: 'index.html' }));

// ---- API REST ----
app.use('/api/produccion', produccionRoutes);
app.use('/api/empleados', empleadosRoutes);

// 404 para rutas de API no encontradas
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta de API no encontrada.' });
});

app.listen(PORT, () => {
  console.log(`Servidor de Finca El Progreso corriendo en http://localhost:${PORT}`);
});
