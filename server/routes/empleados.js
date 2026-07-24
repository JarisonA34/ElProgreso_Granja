const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/empleados — lista de empleados para llenar el <select> del formulario
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, cargo FROM empleados ORDER BY nombre ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar empleados:', err);
    res.status(500).json({ error: 'No se pudo consultar la lista de empleados.' });
  }
});

module.exports = router;
