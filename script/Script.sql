-- Crear la base de datos
CREATE DATABASE chequeos_db;

-- Conectarse a la base de datos 
\c chequeos_db;

-- Crear la tabla chequeos
CREATE TABLE chequeos (
    id VARCHAR(8) PRIMARY KEY,
    estado VARCHAR(50),
    fase_del_chequeo VARCHAR(100),
    cliente TEXT,
    ol VARCHAR(50),
    job VARCHAR(50),
    analisis_a_chequear TEXT,
    numero_muestras INT,
    solicitado_por VARCHAR(100),
    localidad VARCHAR(100)
);

-- Insertar datos en la tabla chequeos
INSERT INTO chequeos (estado, fase_del_chequeo, id, cliente, ol, job, analisis_a_chequear, numero_muestras, solicitado_por, localidad) VALUES
('Pendiente', 'Inicio del Chequeo', 'CK0567', 'SATOR', '98377', 'CO2500383.001', 'COMPLETO', 1, 'Laboratorio', 'BARRANQUILLA'),
('Pendiente', 'Inicio del Chequeo', 'CK0566', 'COMERCIALIZADORA INTERNACIONAL MILPA S.A', '98240', 'CO2500284.002', 'HUMEDAD TOTAL', 1, 'Cliente', 'BARRANQUILLA'),
('Pendiente', 'Inicio del Chequeo', 'CK0565', 'CORDOBA RESOURCES', '98576', 'CO2500392.004-005', 'ASH, BTU', 2, 'Laboratorio', 'BARRANQUILLA'),
('Pendiente', 'Inicio del Chequeo', 'CK0564', 'C.I BULK TRADING SUR AMERICA S.A.S', '98512-1', 'CT2500038.014', '', 0, '', ''),
('Pendiente', 'Inicio del Chequeo', 'CK0563', 'C.I BULK TRADING SUR AMERICA S.A.S', '97870', 'co2500296.002', 'completo iso', 1, 'Laboratorio', 'BARRANQUILLA'),
('Pendiente', 'Inicio del Chequeo', 'CK0562', 'CONCARMIN COAL S.A.S.', '98517-1', 'CO2500354.001', 'CENIZAS+BTU+AZUFRE', 1, 'Oscar Abad', 'BARRANQUILLA'),
('Pendiente', 'Inicio del Chequeo', 'CK0561', 'DRUMMOND LTD', '98594', 'CO2500401.001, CO2500401.003, CO2500401.005', 'CORTO ISO', 3, 'Laboratorio', 'BARRANQUILLA'),
('Pendiente', 'Análisis en Laboratorio', 'CK0559', 'SATOR', '98377', 'CO2500383.001', 'proximos', 1, 'Cliente', 'BARRANQUILLA'),
('Pendiente', 'Revisión Técnica', 'CK0558', 'COMERCIALIZADORA COLOMBIANA DE CARBONES Y COQUES S. A.S. C I', '97920', 'CU2500213.055-CU2500213.056', 'PROXIMO NORMAL', 2, 'Cliente', 'CUCUTA'),
('Pendiente', 'Revisión Técnica', 'CK0554', 'CI. FRONTIER NEXT S.A.S', '98373', 'CO2500336.003 - CO2500336.004', 'AZUFRE', 2, 'Technical Advisor', 'BARRANQUILLA'),
('Pendiente', 'Gestión de IO', 'CK0553', 'DS GROUP NS S.A.S.', '98395', 'CU2500206.009-CU2500206.010', 'CENIZA', 2, 'Cliente', 'CUCUTA'),
('Pendiente', 'En Cabina', 'CK0552', 'IMR METALLURGICAL RESOURCES AG', '98569-1', 'CO2500387.002', 'HT', 1, '', ''),
('Pendiente', 'Revisión Técnica', 'CK0551', 'GENERADORA Y COMERCIALIZADORA DE ENERGIA DEL CARIBE S A ESP - GECELCA S A', '98090-1', 'CO2500240.005', 'CENIZAS+BTU', 1, 'Technical Advisor', 'BARRANQUILLA'),
('Pendiente', 'Revisión Técnica', 'CK0550', 'COMERCIALIZADORA COLOMBIANA DE CARBONES Y COQUES S. A.S. C I', '97920', 'CU2500213.031', 'PROXIMO NORMAL', 1, 'Cliente', 'CUCUTA'),
('Pendiente', 'En Cabina', 'CK0549', 'TRAFIGURA PTE LTD', '97965-1', 'CO2500235.001', 'PROXIMOS CORTOS', 1, 'Laboratorio', 'BARRANQUILLA'),
('Pendiente', 'Actualización de Reporte', 'CK0547', 'FRONTIER MATERIALS S.A.S', '98373', 'CO2500336.003 y CO2500336.004', 'próximos completos', 2, 'Technical Advisor', 'BARRANQUILLA'),
('Pendiente', 'Revisión Técnica', 'CK0545', 'FLAME COLOMBIA S.A.S', '98104-1', 'CO2500197.025', 'CENIZAS', 1, 'Technical Advisor', 'BARRANQUILLA'),
('Pendiente', 'Revisión Técnica', 'CK0544', 'FLAME COLOMBIA S.A.S', '98104-1', 'co2500197.026', 'CENIZAS', 1, 'Technical Advisor', 'BARRANQUILLA'),
('Pendiente', 'Revisión Técnica', 'CK0539', 'FLAME COLOMBIA S.A.S', '98104-1', 'CO2500197.021', 'CENIZAS', 1, 'Technical Advisor', 'BARRANQUILLA'),
('Pendiente', 'Actualización de Reporte', 'CK0525', 'CIPRODYSER S.A.', '98289', 'CO2500293.001', 'Proximos', 1, 'Cliente', 'BARRANQUILLA');


--- sp Gt 
CREATE OR REPLACE FUNCTION GetChequeos(
    p_Cliente TEXT,                    -- Filtrar por cliente (puede ser NULL)
    p_OL VARCHAR(50),                  -- Filtrar por OL (puede ser NULL)
    p_CK VARCHAR(50)                -- Filtrar por Job (puede ser NULL)
    )
RETURNS TABLE (
    id VARCHAR(8),
    estado VARCHAR(50),
    fase_del_chequeo VARCHAR(100),
    cliente TEXT,
    ol VARCHAR(50),
    job VARCHAR(50),
    analisis_a_chequear TEXT,
    numero_muestras INT,
    solicitado_por VARCHAR(100),
    localidad VARCHAR(100)
) AS $$
BEGIN
    -- Retornar chequeos filtrados
    RETURN QUERY
    SELECT c.*
    FROM chequeos c
    WHERE (p_Cliente IS NULL OR c.cliente ILIKE CONCAT('%', p_Cliente, '%'))  -- Filtrar por cliente
    AND (p_OL IS NULL OR c.ol ILIKE CONCAT('%', p_OL, '%'))  -- Filtrar por OL
    AND (p_CK IS NULL OR c.id ILIKE CONCAT('%', p_CK, '%'));  -- Filtrar por idx
END; 
$$ LANGUAGE plpgsql;
