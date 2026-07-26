const express = require('express');
const router = express.Router();
const pool = require('../db');

const TURNOS = ['Mañana', 'Tarde'];
const ESTADOS = ['Registrado', 'Verificado', 'Anulado'];

/**
 * Valida el cuerpo de la petición para crear/actualizar un registro
 * de producción. Devuelve un arreglo de mensajes de error (vacío si es válido).
 */
function validarProduccion(body) {
  const errores = [];
  const { fecha, turno, cantidad_litros, empleado_id, estado, observaciones } = body;

  // Campos obligatorios
  if (!fecha) errores.push('La fecha es obligatoria.');
  else if (isNaN(Date.parse(fecha))) errores.push('La fecha no tiene un formato válido.');

  if (!turno) errores.push('El turno es obligatorio.');
  else if (!TURNOS.includes(turno)) errores.push('El turno debe ser "Mañana" o "Tarde".');

  if (cantidad_litros === undefined || cantidad_litros === null || cantidad_litros === '') {
    errores.push('La cantidad de litros es obligatoria.');
  } else if (isNaN(Number(cantidad_litros))) {
    errores.push('La cantidad de litros debe ser un número.');
  } else if (Number(cantidad_litros) <= 0) {
    errores.push('La cantidad de litros debe ser mayor a 0.');
  } else if (Number(cantidad_litros) > 99999.99) {
    errores.push('La cantidad de litros no puede superar 99,999.99.');
  }

  if (!empleado_id) errores.push('Debe seleccionar un empleado responsable.');
  else if (isNaN(Number(empleado_id))) errores.push('El empleado seleccionado no es válido.');

  if (estado && !ESTADOS.includes(estado)) {
    errores.push('El estado debe ser "Registrado", "Verificado" o "Anulado".');
  }

  // Validación de longitud de campo (texto libre)
  const obs = (observaciones || '').trim();
  if (!obs) {
    errores.push('Las observaciones son obligatorias.');
  } else if (obs.length < 5) {
    errores.push('Las observaciones deben tener al menos 5 caracteres.');
  } else if (obs.length > 200) {
    errores.push('Las observaciones no pueden superar 200 caracteres.');
  }

  return errores;
}

// GET /api/produccion — reporte completo (join con empleados)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.id, p.fecha, p.turno, p.cantidad_litros, p.estado, p.observaciones, p.creado_en,
             e.id AS empleado_id, e.nombre AS empleado_nombre
      FROM produccion_leche p
      JOIN empleados e ON e.id = p.empleado_id
      ORDER BY p.fecha DESC, p.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar producción:', err);
    res.status(500).json({ error: 'No se pudo consultar la producción registrada.' });
  }
});

// GET /api/produccion/:id — un solo registro (para precargar el formulario al editar)
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM produccion_leche WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al consultar el registro:', err);
    res.status(500).json({ error: 'No se pudo consultar el registro.' });
  }
});

// POST /api/produccion — crear
router.post('/', async (req, res) => {
  const errores = validarProduccion(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const { fecha, turno, cantidad_litros, empleado_id, estado, observaciones } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO produccion_leche (fecha, turno, cantidad_litros, empleado_id, estado, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [fecha, turno, cantidad_litros, empleado_id, estado || 'Registrado', observaciones.trim()]
    );
    res.status(201).json({ mensaje: 'Registro guardado correctamente.', registro: rows[0] });
  } catch (err) {
    console.error('Error al guardar el registro:', err);
    res.status(500).json({ error: 'No se pudo guardar el registro.' });
  }
});

// PUT /api/produccion/:id — actualizar
router.put('/:id', async (req, res) => {
  const errores = validarProduccion(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const { fecha, turno, cantidad_litros, empleado_id, estado, observaciones } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE produccion_leche
       SET fecha = $1, turno = $2, cantidad_litros = $3, empleado_id = $4, estado = $5, observaciones = $6
       WHERE id = $7 RETURNING *`,
      [fecha, turno, cantidad_litros, empleado_id, estado, observaciones.trim(), req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }
    res.json({ mensaje: 'Registro actualizado correctamente.', registro: rows[0] });
  } catch (err) {
    console.error('Error al actualizar el registro:', err);
    res.status(500).json({ error: 'No se pudo actualizar el registro.' });
  }
});

// DELETE /api/produccion/:id — eliminar
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM produccion_leche WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }
    res.json({ mensaje: 'Registro eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar el registro:', err);
    res.status(500).json({ error: 'No se pudo eliminar el registro.' });
  }
});

module.exports = router;
