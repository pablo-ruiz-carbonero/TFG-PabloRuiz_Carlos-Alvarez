-- ============================================================
--  AgroLink — Datos de prueba
--  Contraseña de todos los usuarios: Password123
-- ============================================================

-- ROLES
INSERT INTO roles (nombre) VALUES
('agricultor'),
('distribuidor'),
('proveedor'),
('administrador');

-- ============================================================
-- USUARIOS
-- hash bcrypt (rounds=10) de "Password123"
-- ============================================================
INSERT INTO usuarios (nombre, email, password, telefono, rol_id) VALUES
('María García Ruiz',     'maria.garcia@agrolink.es',    '$2b$10$CWCy7CSYIhENxeKLRiXy4.jspWt90t.E4h0VDkp7sfu6hPvQxGZQC', '622111001', 1),
('Antonio López Moreno',  'antonio.lopez@agrolink.es',   '$2b$10$CWCy7CSYIhENxeKLRiXy4.jspWt90t.E4h0VDkp7sfu6hPvQxGZQC', '622111002', 1),
('Carmen Martínez Vega',  'carmen.martinez@agrolink.es', '$2b$10$CWCy7CSYIhENxeKLRiXy4.jspWt90t.E4h0VDkp7sfu6hPvQxGZQC', '622111003', 1),
('José Rodríguez Alba',   'jose.rodriguez@agrolink.es',  '$2b$10$CWCy7CSYIhENxeKLRiXy4.jspWt90t.E4h0VDkp7sfu6hPvQxGZQC', '633222001', 2),
('Laura Sánchez Ríos',    'laura.sanchez@agrolink.es',   '$2b$10$CWCy7CSYIhENxeKLRiXy4.jspWt90t.E4h0VDkp7sfu6hPvQxGZQC', '633222002', 2),
('Pedro Fernández Cruz',  'pedro.fernandez@agrolink.es', '$2b$10$CWCy7CSYIhENxeKLRiXy4.jspWt90t.E4h0VDkp7sfu6hPvQxGZQC', '644333001', 3),
('Isabel González Pino',  'isabel.gonzalez@agrolink.es', '$2b$10$CWCy7CSYIhENxeKLRiXy4.jspWt90t.E4h0VDkp7sfu6hPvQxGZQC', '644333002', 3),
('Admin AgroLink',        'admin@agrolink.es',           '$2b$10$CWCy7CSYIhENxeKLRiXy4.jspWt90t.E4h0VDkp7sfu6hPvQxGZQC', '600000001', 4);

-- ============================================================
-- PARCELAS  (solo agricultores: IDs 1, 2, 3)
-- ============================================================
INSERT INTO parcelas (usuario_id, nombre, ubicacion, tamano) VALUES
(1, 'Finca La Esperanza',   'Carmona, Sevilla',     12.50),
(1, 'Parcela Norte',        'Carmona, Sevilla',      5.00),
(2, 'Huerta El Carmen',     'Paterna, Valencia',     3.20),
(2, 'Invernadero Sur',      'Paterna, Valencia',     1.80),
(3, 'Olivar San Rafael',    'Martos, Jaén',         20.00),
(3, 'Viñedo La Cañada',     'Montilla, Córdoba',     8.50);

-- ============================================================
-- CULTIVOS
-- ============================================================
INSERT INTO cultivos (
  nombre, variedad, tipo_cultivo, superficie,
  fecha_siembra, fase_actual, fecha_cosecha_esperada, produccion_esperada,
  notas, ultimo_riego, ultima_fertilizacion, dias_riego, dias_fertilizacion,
  status, usuario_id, parcela_id
) VALUES
-- María — Finca La Esperanza
('Trigo',    'Trigo blando',    'cereal',    8.00,
 '2025-11-15', 'maduración',   '2026-06-30', 4000.00,
 'Variedad de ciclo largo. Buen desarrollo vegetativo.',
 '2026-05-20', '2026-04-10', 10, 30, 'active', 1, 1),

('Girasol',  'Girasol oleico',  'oleaginosa', 4.50,
 '2026-03-20', 'floración',    '2026-08-15', 1800.00,
 'Riego por goteo instalado en marzo.',
 '2026-05-22', '2026-04-25', 7, 21, 'active', 1, 1),

-- María — Parcela Norte
('Cebada',   'Cebada cervecera','cereal',    5.00,
 '2025-10-01', 'cosecha',      '2026-06-05', 2500.00,
 'Lista para cosechar en las próximas semanas.',
 '2026-05-10', '2026-03-20', 14, 30, 'active', 1, 2),

-- Antonio — Huerta El Carmen
('Tomate',   'Tomate de rama',  'hortaliza', 1.50,
 '2026-02-10', 'maduración',   '2026-07-20', 9000.00,
 'Producción en espaldera. Riego por goteo.',
 '2026-05-25', '2026-05-01', 3, 14, 'active', 2, 3),

('Pimiento', 'Pimiento rojo',   'hortaliza', 1.00,
 '2026-02-20', 'crecimiento',  '2026-08-01', 5000.00,
 'Plantas sanas, sin incidencias de plagas.',
 '2026-05-24', '2026-05-05', 3, 14, 'active', 2, 3),

-- Antonio — Invernadero Sur
('Lechuga',  'Lechuga iceberg', 'hortaliza', 0.80,
 '2026-04-15', 'crecimiento',  '2026-06-10', 3200.00,
 'Segunda rotación del invernadero.',
 '2026-05-25', '2026-05-10', 2, 10, 'active', 2, 4),

-- Carmen — Olivar San Rafael
('Olivo',    'Picual',          'frutal',   20.00,
 '2015-03-01', 'crecimiento',  '2026-11-15', 50000.00,
 'Olivar adulto con riego deficitario controlado.',
 '2026-05-18', '2026-03-01', 15, 60, 'active', 3, 5),

-- Carmen — Viñedo La Cañada
('Vid',      'Tempranillo',     'frutal',    8.50,
 '2010-04-15', 'floración',    '2026-09-20', 42500.00,
 'Vendimia manual prevista para septiembre.',
 '2026-05-15', '2026-04-05', 10, 45, 'active', 3, 6);

-- ============================================================
-- TAREAS
-- ============================================================
INSERT INTO tareas (cultivo_id, tipo, fecha, hora, descripcion, cantidad, unidad, status) VALUES
-- Trigo (id=1)
(1, 'fertilizacion', '2026-04-10', '08:00:00', 'Abonado de cobertera con urea', 150.00, 'kg/ha', 'completada'),
(1, 'riego',         '2026-05-20', '06:30:00', 'Riego de apoyo antes de espigado', 40.00, 'mm', 'completada'),
(1, 'cosecha',       '2026-06-30', '07:00:00', 'Cosecha mecanizada con cosechadora', NULL, NULL, 'pendiente'),

-- Girasol (id=2)
(2, 'siembra',       '2026-03-20', '08:00:00', 'Siembra directa con sembradora de precisión', 5.00, 'kg/ha', 'completada'),
(2, 'riego',         '2026-05-22', '07:00:00', 'Riego por goteo fase floración', 30.00, 'mm', 'completada'),
(2, 'plaguicida',    '2026-05-28', '09:00:00', 'Tratamiento preventivo contra pulgón', 1.50, 'l/ha', 'pendiente'),

-- Cebada (id=3)
(3, 'riego',         '2026-05-10', '06:00:00', 'Último riego antes de cosecha', 25.00, 'mm', 'completada'),
(3, 'cosecha',       '2026-06-05', '07:00:00', 'Cosecha. Contratar cosechadora externa', NULL, NULL, 'pendiente'),

-- Tomate (id=4)
(4, 'riego',         '2026-05-25', '06:00:00', 'Riego diario por goteo', 8.00, 'l/planta', 'completada'),
(4, 'fertilizacion', '2026-05-01', '08:00:00', 'Fertirrigación con NPK 10-5-20', 3.00, 'kg/1000l', 'completada'),
(4, 'plaguicida',    '2026-06-02', '08:30:00', 'Aplicación de cobre contra mildiu', 2.00, 'kg/ha', 'pendiente'),

-- Pimiento (id=5)
(5, 'riego',         '2026-05-24', '06:30:00', 'Riego localizado', 6.00, 'l/planta', 'completada'),
(5, 'fertilizacion', '2026-05-05', '09:00:00', 'Aportación de potasio para engorde', 2.50, 'kg/1000l', 'completada'),

-- Lechuga (id=6)
(6, 'riego',         '2026-05-25', '07:00:00', 'Riego automatizado invernadero', 4.00, 'l/planta', 'completada'),
(6, 'cosecha',       '2026-06-10', '06:00:00', 'Recolección manual y embolsado', NULL, NULL, 'pendiente'),

-- Olivo (id=7)
(7, 'plaguicida',    '2026-05-18', '08:00:00', 'Tratamiento contra mosca del olivo', 2.00, 'l/ha', 'completada'),
(7, 'fertilizacion', '2026-03-01', '09:00:00', 'Abonado de fondo con compost', 2000.00, 'kg/ha', 'completada'),
(7, 'cosecha',       '2026-11-15', '07:00:00', 'Vibrado mecanizado y recogida', NULL, NULL, 'pendiente'),

-- Vid (id=8)
(8, 'plaguicida',    '2026-05-30', '08:00:00', 'Tratamiento con azufre contra oídio', 3.00, 'kg/ha', 'pendiente'),
(8, 'riego',         '2026-05-15', '07:00:00', 'Riego deficitario fase floración', 15.00, 'mm', 'completada'),
(8, 'cosecha',       '2026-09-20', '06:30:00', 'Vendimia manual. Contratar cuadrilla', NULL, NULL, 'pendiente');

-- ============================================================
-- PRODUCCIONES (histórico de cosechas anteriores)
-- ============================================================
INSERT INTO producciones (cultivo_id, cantidad, fecha) VALUES
-- Trigo cosechas anteriores
(1, 3850.00, '2025-06-28'),
(1, 3600.00, '2024-07-02'),
-- Cebada
(3, 2300.00, '2025-06-10'),
-- Tomate (temporadas)
(4, 8200.00, '2025-07-15'),
(4, 7900.00, '2024-07-20'),
-- Pimiento
(5, 4600.00, '2025-08-05'),
-- Olivo (bianual bueno/malo)
(7, 48000.00, '2025-11-20'),
(7, 32000.00, '2024-11-18'),
(7, 51000.00, '2023-11-22'),
-- Vid
(8, 40000.00, '2025-09-18'),
(8, 38500.00, '2024-09-25');

-- ============================================================
-- PRODUCTOS (marketplace)
-- ============================================================
INSERT INTO productos (usuario_id, nombre, categoria, descripcion, precio, unidad, stock, provincia) VALUES
-- Agricultores vendiendo produce
(1, 'Trigo blando cosecha 2025',   'cereal',      'Trigo de alta calidad, humedad controlada. Certificado sin OGM.',                 0.24, 'kg',  15000, 'Sevilla'),
(1, 'Girasol oleico',              'oleaginosa',  'Girasol oleico seco, limpio y cribado. Ideal para extracción de aceite.',         0.42, 'kg',   4200, 'Sevilla'),
(2, 'Tomate de rama extra',        'hortaliza',   'Tomate de rama en racimo, calibre M-G, perfectamente maduro.',                   1.80, 'kg',    500, 'Valencia'),
(2, 'Pimiento rojo california',    'hortaliza',   'Pimiento rojo californiano, calibre 70/90. Producción integrada.',               2.10, 'kg',    300, 'Valencia'),
(2, 'Lechuga iceberg',             'hortaliza',   'Lechuga iceberg de invernadero. Enviada en caja de 12 unidades.',                0.65, 'ud',    800, 'Valencia'),
(3, 'Aceite de oliva virgen extra','aceite',      'AOVE monovarietal Picual, cosecha 2025. Acidez < 0,2°. Botella 5L.',            14.50, 'botella',200,'Jaén'),
(3, 'Aceitunas Picual en verde',   'fruto',       'Aceitunas para almazara, calibre 30-35. Recogida en óptimo de madurez.',          0.55, 'kg',   8000, 'Jaén'),
-- Proveedores vendiendo insumos
(6, 'Fertilizante NPK 15-15-15',   'fertilizante','Abono complejo granulado de liberación estándar. Saco 25 kg.',                   22.00, 'saco',  150, 'Córdoba'),
(6, 'Urea 46%',                    'fertilizante','Urea de alta pureza para abonado de cobertera. Saco 25 kg.',                     18.50, 'saco',  200, 'Córdoba'),
(6, 'Semillas de girasol oleico',  'semilla',     'Variedad certificada alto oleico. Tratada con fungicida. Dosis 5 kg/ha.',        12.00, 'kg',     80, 'Córdoba'),
(7, 'Fungicida cúprico',           'fitosanitario','Oxicloruro de cobre 50%. Autorizado en agricultura ecológica. Garrafa 10L.',    35.00, 'garrafa', 60,'Huelva'),
(7, 'Sulfato de azufre micronizado','fitosanitario','Azufre micronizado 80%. Contra oídio y ácaros. Saco 25 kg.',                    9.90, 'saco',  120, 'Huelva'),
(7, 'Insecticida lambda-cihalotrin','fitosanitario','Concentrado emulsionable 10%. Amplio espectro. Botella 1L.',                   28.00, 'botella', 45,'Huelva');

-- ============================================================
-- CONVERSACIONES Y MENSAJES
-- ============================================================

-- Conversación 1: María (1) ↔ Pedro proveedor (6) sobre fertilizante
INSERT INTO conversaciones (usuario_a_id, usuario_b_id, leido_a, leido_b) VALUES (1, 6, 1, 0);

INSERT INTO mensajes (conversacion_id, emisor_id, contenido, leido) VALUES
(1, 1, 'Hola Pedro, ¿tienes disponible el NPK 15-15-15? Necesito unos 50 sacos para la próxima semana.', 1),
(1, 6, 'Hola María, sí tenemos stock. Puedo hacerte un precio de 20€/saco para pedidos de más de 40 sacos.', 1),
(1, 1, 'Perfecto, me interesa. ¿Puedes traerlo el miércoles por la mañana a Carmona?', 1),
(1, 6, 'Sin problema, el miércoles a las 9h. ¿Me confirmas la dirección de la finca?', 0);

-- Conversación 2: Antonio (2) ↔ José distribuidor (4) sobre tomates
INSERT INTO conversaciones (usuario_a_id, usuario_b_id, leido_a, leido_b) VALUES (2, 4, 1, 1);

INSERT INTO mensajes (conversacion_id, emisor_id, contenido, leido) VALUES
(2, 4, 'Antonio, buenos días. Tenemos clientes que buscan tomate de rama para julio. ¿Cuánto esperas cosechar?', 1),
(2, 2, 'Calculamos unos 500 kg la primera semana de julio y luego a pleno rendimiento. ¿Qué precio ofreces?', 1),
(2, 4, 'Podría pagarte 1,60€/kg recogido en tu finca. Para tenerlo asegurado firmaríamos un acuerdo ahora.', 1),
(2, 2, 'Necesito pensarlo, mi precio en el mercado local es de 1,80€. ¿Puedes subir algo?', 1),
(2, 4, 'Puedo llegar a 1,70€ si me garantizas mínimo 400 kg semanales durante 6 semanas.', 1);

-- Conversación 3: Carmen (3) ↔ Laura distribuidora (5) sobre aceite
INSERT INTO conversaciones (usuario_a_id, usuario_b_id, leido_a, leido_b) VALUES (3, 5, 0, 1);

INSERT INTO mensajes (conversacion_id, emisor_id, contenido, leido) VALUES
(3, 5, 'Carmen, me ha llegado tu anuncio de AOVE Picual. ¿Tienes botellas de 5L disponibles ahora mismo?', 1),
(3, 3, 'Hola Laura, tenemos 200 botellas de la cosecha 2025 listas para enviar. Acidez 0,18°.', 1),
(3, 5, 'Excelente. ¿Haces descuento por pedido de 100 botellas?', 1),
(3, 3, 'Para 100 unidades te hago el envío gratis y 13,50€/botella.', 0);

-- Conversación 4: Antonio (2) ↔ Isabel proveedora (7) sobre fungicida
INSERT INTO conversaciones (usuario_a_id, usuario_b_id, leido_a, leido_b) VALUES (2, 7, 1, 1);

INSERT INTO mensajes (conversacion_id, emisor_id, contenido, leido) VALUES
(4, 2, 'Isabel, ¿el fungicida cúprico está autorizado para tomate en producción integrada?', 1),
(4, 7, 'Sí Antonio, está en la lista de fitosanitarios autorizados para tomate. Plazo de seguridad 7 días.', 1),
(4, 2, 'Perfecto. Me llevo 3 garrafas entonces.', 1),
(4, 7, 'Te las preparo. ¿Quieres que te incluya la ficha técnica del producto?', 1);
