
-- ===========================================
-- Trabajo Práctico 1 - Base de Datos II
-- Ejercicios 1 a 9
-- ===========================================

-- ===========================================
-- Ejercicio 1: Reglas de Integridad Referencial
-- ===========================================

CREATE TABLE Estudiantes (
  id_estudiante INT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL
);

CREATE TABLE Cursos (
  id_curso INT PRIMARY KEY,
  nombre   VARCHAR(100) NOT NULL
);

CREATE TABLE Matriculas (
  id_matricula  INT PRIMARY KEY,
  id_estudiante INT,
  id_curso      INT,  
  fecha         DATE,
  FOREIGN KEY (id_estudiante)
    REFERENCES Estudiantes(id_estudiante)
    ON DELETE CASCADE,
  FOREIGN KEY (id_curso)
    REFERENCES Cursos(id_curso)
    ON DELETE RESTRICT
);

INSERT INTO Estudiantes (id_estudiante, nombre) VALUES
(1, 'Ana Martínez'),
(2, 'Carlos Gómez'),
(3, 'Lucía Fernández');

INSERT INTO Cursos (id_curso, nombre) VALUES
(101, 'Matemática'),
(102, 'Programación'),
(103, 'Bases de Datos');

INSERT INTO Matriculas (id_matricula, id_estudiante, id_curso, fecha) VALUES
(1001, 1, 101, '2024-03-01'),
(1002, 1, 102, '2024-03-02'),
(1003, 2, 103, '2024-03-03');

-- ===========================================
-- Ejercicio 2: Violación de Restricciones
-- ===========================================

-- Este INSERT generará error por violar la clave foránea
-- INSERT INTO Matriculas (id_matricula, id_estudiante, id_curso, fecha)
-- VALUES (1004, 99, 101, '2024-03-10');

-- ===========================================
-- Ejercicio 3: Concurrencia
-- ===========================================

CREATE TABLE Cuentas (
  id_cuenta INT PRIMARY KEY,
  titular   VARCHAR(100),
  saldo     DECIMAL(10,2)
);

INSERT INTO Cuentas (id_cuenta, titular, saldo) VALUES
(1, 'Juan Pérez', 1000.00);

-- Simulación de concurrencia y niveles de aislamiento:
-- Usuario A y B ejecutan transacciones con READ COMMITTED vs SERIALIZABLE

-- ===========================================
-- Ejercicio 4: Plan de Ejecución
-- ===========================================

-- Supone una tabla con más de 100,000 registros llamada "Clientes"
-- Consulta sin índice:
EXPLAIN SELECT * FROM Clientes WHERE apellido = 'Gómez';

-- Crear índice:
CREATE INDEX idx_apellido ON Clientes(apellido);

-- Consulta con índice:
EXPLAIN SELECT * FROM Clientes WHERE apellido = 'Gómez';

-- Comparar los resultados del plan de ejecución.

-- ===========================================
-- Ejercicio 5: Creación de Índices
-- ===========================================

-- Supongamos tabla de ventas:
SELECT * FROM Ventas WHERE cliente_id = 3 AND fecha >= '2024-01-01';

-- Índices posibles:
CREATE INDEX idx_cliente ON Ventas(cliente_id);
CREATE INDEX idx_cliente_fecha ON Ventas(cliente_id, fecha);

-- Comparar el rendimiento de ambas.

-- ===========================================
-- Ejercicio 6: Vistas
-- ===========================================

-- Vista de resumen de ventas mensuales:
CREATE VIEW VentasMensuales AS
SELECT producto_id, MONTH(fecha) AS mes, SUM(total) AS total_ventas
FROM Ventas
GROUP BY producto_id, MONTH(fecha);

-- Consulta para top 5 productos más vendidos:
SELECT producto_id, SUM(total_ventas) AS total
FROM VentasMensuales
GROUP BY producto_id
ORDER BY total DESC
LIMIT 5;

-- ===========================================
-- Ejercicio 7: Gestión de Permisos
-- ===========================================

-- Crear usuario con permisos limitados:
CREATE USER 'analista'@'localhost' IDENTIFIED BY '1234';
GRANT SELECT ON BaseDeDatos.Clientes TO 'analista'@'localhost';

-- Intentar:
-- INSERT INTO Clientes VALUES (...);
-- -- Resultado: Error por falta de privilegios

-- ===========================================
-- Ejercicio 8: Seguridad y Auditoría
-- ===========================================

-- Crear tabla de auditoría:
CREATE TABLE Auditoria (
   id INT AUTO_INCREMENT PRIMARY KEY,
   accion VARCHAR(10),
   fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   usuario VARCHAR(50),
   id_cliente INT
);

-- Crear triggers:
 DELIMITER //
 CREATE TRIGGER trg_insert_cliente
 AFTER INSERT ON Clientes
 FOR EACH ROW
 BEGIN
   INSERT INTO Auditoria (accion, usuario, id_cliente)
   VALUES ('INSERT', CURRENT_USER(), NEW.id_cliente);
   END;
//
DELIMITER ;

-- Repetir para UPDATE y DELETE

-- ===========================================
-- Ejercicio 9: Backup y Restore
-- ===========================================

-- Backup completo en MySQL:
-- mysqldump -u root -p basededatos > backup.sql

-- Restaurar:
-- mysql -u root -p basededatos < backup.sql

-- Simular pérdida:
-- DROP TABLE Clientes;
-- Restaurar con backup.sql