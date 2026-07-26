-- =========================================================
-- Migración: agrega la columna "observaciones" a una base
-- de datos que ya fue creada con la versión anterior del
-- esquema (antes de incluir esta columna).
--
-- Ejecuta este script UNA sola vez en DBeaver, conectado a
-- la base finca_el_progreso, si ya habías corrido schema.sql
-- y seed.sql antes de esta actualización.
-- =========================================================

-- 1. Agregar la columna permitiendo NULL temporalmente
ALTER TABLE produccion_leche ADD COLUMN IF NOT EXISTS observaciones VARCHAR(200);

-- 2. Rellenar los registros existentes que quedaron sin valor
UPDATE produccion_leche
SET observaciones = 'Registro migrado sin observaciones.'
WHERE observaciones IS NULL;

-- 3. Exigir la regla de longitud mínima y obligatoriedad hacia adelante
ALTER TABLE produccion_leche ALTER COLUMN observaciones SET NOT NULL;
ALTER TABLE produccion_leche
  ADD CONSTRAINT observaciones_longitud_minima CHECK (char_length(observaciones) >= 5);
