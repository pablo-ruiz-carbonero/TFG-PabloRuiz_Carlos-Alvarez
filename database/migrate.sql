-- Migraciones para completar el schema sin perder datos existentes
-- Ejecutar UNA VEZ contra la base de datos ya creada

-- 1. parcelas: añadir columna tamano
ALTER TABLE parcelas
  ADD COLUMN tamano DECIMAL(10, 2) NULL;

-- 2. productos: añadir columnas que faltan
ALTER TABLE productos
  ADD COLUMN categoria VARCHAR(50)  NULL AFTER nombre,
  ADD COLUMN unidad    VARCHAR(20)  NULL AFTER precio,
  ADD COLUMN stock     INT          NOT NULL DEFAULT 0 AFTER unidad,
  ADD COLUMN provincia VARCHAR(100) NULL AFTER stock;

-- 3. crear tabla conversaciones
CREATE TABLE IF NOT EXISTS conversaciones (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_a_id  INT NOT NULL,
  usuario_b_id  INT NOT NULL,
  leido_a       TINYINT(1) NOT NULL DEFAULT 0,
  leido_b       TINYINT(1) NOT NULL DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_participantes (usuario_a_id, usuario_b_id),
  FOREIGN KEY (usuario_a_id) REFERENCES usuarios(id),
  FOREIGN KEY (usuario_b_id) REFERENCES usuarios(id)
);

-- 4. rediseñar tabla mensajes para usar conversaciones
--    (si la tabla mensajes ya tiene datos, primero se migran)
ALTER TABLE mensajes
  ADD COLUMN conversacion_id INT NULL AFTER id,
  ADD COLUMN leido TINYINT(1) NOT NULL DEFAULT 0 AFTER contenido,
  MODIFY COLUMN emisor_id INT NOT NULL,
  MODIFY COLUMN contenido TEXT NOT NULL;

-- Renombrar columna fecha_envio sigue igual, solo añadimos FK
ALTER TABLE mensajes
  ADD CONSTRAINT fk_mensajes_conversacion
    FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE CASCADE;

-- 5. añadir tipo 'plaguicida' al enum de tareas (soporta ActivityType='pest' del web)
ALTER TABLE tareas
  MODIFY tipo ENUM('siembra','riego','fertilizacion','cosecha','plaguicida') NOT NULL;

-- 6. productos: columna imagenes (JSON) para URLs de fotos subidas desde la app móvil
ALTER TABLE productos
  ADD COLUMN imagenes JSON NULL AFTER provincia;
