-- =========================================================
-- Finca El Progreso — Esquema de base de datos
-- Proceso: Registro de Producción de Leche
-- =========================================================

-- Tabla catálogo de empleados (relacionada como llave foránea
-- desde produccion_leche, ya que cada registro de ordeño
-- pertenece a un empleado responsable).
CREATE TABLE IF NOT EXISTS empleados (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL,
  cargo   VARCHAR(80)
);

-- Tabla principal del proceso: producción de leche por ordeño.
CREATE TABLE IF NOT EXISTS produccion_leche (
  id               SERIAL PRIMARY KEY,
  fecha            DATE NOT NULL,
  turno            VARCHAR(20) NOT NULL
                    CHECK (turno IN ('Mañana', 'Tarde')),
  cantidad_litros  NUMERIC(8,2) NOT NULL
                    CHECK (cantidad_litros > 0),
  empleado_id      INTEGER NOT NULL
                    REFERENCES empleados(id) ON DELETE RESTRICT,
  estado           VARCHAR(20) NOT NULL DEFAULT 'Registrado'
                    CHECK (estado IN ('Registrado', 'Verificado', 'Anulado')),
  observaciones    VARCHAR(200) NOT NULL
                    CHECK (char_length(observaciones) >= 5),
  creado_en        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_produccion_fecha ON produccion_leche(fecha);
CREATE INDEX IF NOT EXISTS idx_produccion_empleado ON produccion_leche(empleado_id);
