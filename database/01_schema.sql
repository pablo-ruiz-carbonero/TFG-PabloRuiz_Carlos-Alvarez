-- ROLES
CREATE TABLE
    roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL
    );

-- USUARIOS
CREATE TABLE
    usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        telefono VARCHAR(20),
        rol_id INT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rol_id) REFERENCES roles (id)
    );

-- PARCELAS
CREATE TABLE
    parcelas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        nombre VARCHAR(100),
        ubicacion VARCHAR(255),
        tamano DECIMAL(10, 2),
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    );

-- CULTIVOS
CREATE TABLE
    cultivos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        variedad VARCHAR(100),
        tipo_cultivo VARCHAR(50),
        superficie DECIMAL(10, 2),
        fecha_siembra DATE,
        fase_actual VARCHAR(50),
        fecha_cosecha_esperada DATE,
        produccion_esperada DECIMAL(10, 2),
        notas TEXT,
        ultimo_riego DATE,
        ultima_fertilizacion DATE,
        dias_riego INT,
        dias_fertilizacion INT,
        status VARCHAR(20) DEFAULT 'active',
        usuario_id INT,
        parcela_id INT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
        FOREIGN KEY (parcela_id) REFERENCES parcelas (id)
    );

-- TAREAS
CREATE TABLE
    tareas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cultivo_id INT,
        tipo ENUM ('siembra', 'riego', 'fertilizacion', 'cosecha', 'plaguicida'),
        fecha DATE,
        hora TIME,
        descripcion TEXT,
        cantidad DECIMAL(10, 2),
        unidad VARCHAR(20),
        status VARCHAR(20) DEFAULT 'pendiente',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cultivo_id) REFERENCES cultivos (id)
    );

-- PRODUCCIONES
CREATE TABLE
    producciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cultivo_id INT,
        cantidad DECIMAL(10, 2),
        fecha DATE,
        FOREIGN KEY (cultivo_id) REFERENCES cultivos (id)
    );

-- PRODUCTOS
CREATE TABLE
    productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        nombre VARCHAR(100),
        categoria VARCHAR(50),
        descripcion TEXT,
        precio DECIMAL(10, 2),
        unidad VARCHAR(20),
        stock INT NOT NULL DEFAULT 0,
        provincia VARCHAR(100),
        fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    );

-- CONVERSACIONES (agrupa mensajes entre dos usuarios)
CREATE TABLE
    conversaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_a_id INT NOT NULL,
        usuario_b_id INT NOT NULL,
        leido_a TINYINT(1) NOT NULL DEFAULT 0,
        leido_b TINYINT(1) NOT NULL DEFAULT 0,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_participantes (usuario_a_id, usuario_b_id),
        FOREIGN KEY (usuario_a_id) REFERENCES usuarios (id),
        FOREIGN KEY (usuario_b_id) REFERENCES usuarios (id)
    );

-- MENSAJES
CREATE TABLE
    mensajes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversacion_id INT NOT NULL,
        emisor_id INT NOT NULL,
        contenido TEXT NOT NULL,
        leido TINYINT(1) NOT NULL DEFAULT 0,
        fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversacion_id) REFERENCES conversaciones (id) ON DELETE CASCADE,
        FOREIGN KEY (emisor_id) REFERENCES usuarios (id)
    );
