-- =========================================================
-- Finca El Progreso — Datos de prueba
-- =========================================================

INSERT INTO empleados (nombre, cargo) VALUES
  ('José Ureña',    'Jefe de ordeño'),
  ('Miguel Féliz',  'Encargado de potreros'),
  ('Yolanda Peña',  'Médica veterinaria')
ON CONFLICT DO NOTHING;

INSERT INTO produccion_leche (fecha, turno, cantidad_litros, empleado_id, estado, observaciones) VALUES
  ('2026-07-14', 'Mañana', 320.50, 1, 'Verificado', 'Ordeño sin novedades, animales sanos.'),
  ('2026-07-14', 'Tarde',  280.00, 1, 'Verificado', 'Producción normal, sin incidencias.'),
  ('2026-07-15', 'Mañana', 310.75, 2, 'Registrado', 'Una vaca con leve cojera, se avisó a veterinaria.'),
  ('2026-07-16', 'Mañana', 305.00, 1, 'Registrado', 'Todo en orden.'),
  ('2026-07-16', 'Tarde',  275.25, 2, 'Anulado',    'Registro anulado por error de báscula.')
ON CONFLICT DO NOTHING;
