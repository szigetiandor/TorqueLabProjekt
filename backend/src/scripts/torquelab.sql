IF DB_ID('TorqueLab') IS NOT NULL

BEGIN
    ALTER DATABASE TorqueLab SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE TorqueLab;
END

GO

CREATE DATABASE TorqueLab;

GO

USE TorqueLab;

GO

CREATE TABLE [user] (
    user_id INT IDENTITY PRIMARY KEY,
    [name] VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BIT NOT NULL DEFAULT 0
);

CREATE TABLE car (
    car_id INT IDENTITY PRIMARY KEY,
    vin VARCHAR(17) NOT NULL UNIQUE,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    production_year INT NOT NULL,
    engine VARCHAR(50),
    mileage INT,
    owner_id INT NOT NULL,

    FOREIGN KEY (owner_id) REFERENCES [user](user_id)
);

CREATE TABLE part (
    part_id INT IDENTITY PRIMARY KEY,
    [name] VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    part_number VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    [description] VARCHAR(255)
);

CREATE TABLE service_log (
    service_id INT IDENTITY PRIMARY KEY,
    car_id INT NOT NULL,
    performed_by INT NOT NULL,
    service_date DATE NOT NULL DEFAULT GETDATE(),
    [description] VARCHAR(255),

    FOREIGN KEY (car_id) REFERENCES car(car_id),
    FOREIGN KEY (performed_by) REFERENCES [user](user_id)
);

-- Ez a tábla ahhoz kell, hogy a szervíz naplókhoz lehessen kötni alkatrészeket
CREATE TABLE service_part (
    service_part_id INT IDENTITY PRIMARY KEY,
    service_id INT NOT NULL,
    part_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (service_id) REFERENCES service_log(service_id),
    FOREIGN KEY (part_id) REFERENCES part(part_id)
);

GO

INSERT INTO [user] (name, email, password_hash, is_admin) VALUES
('John Doe', 'john.doe@email.com', 'hash_john', 0),
('Emily Smith', 'emily.smith@email.com', 'hash_emily', 0),
('Mike Johnson', 'mike.johnson@torquelab.com', 'hash_mike', 1);

INSERT INTO car
(vin, brand, model, production_year, engine, mileage, owner_id)
VALUES
('WF0AXXWPMAG123456', 'Ford', 'Focus', 2018, '1.5 EcoBoost', 85000, 1),
('1FA6P8TH0J5102345', 'Ford', 'Mustang', 2020, '2.3 EcoBoost', 42000, 2),
('WF0FXXGCDGJ987654', 'Ford', 'Fiesta', 2016, '1.0 EcoBoost', 120000, 1);

INSERT INTO part
(name, manufacturer, part_number, price, stock_quantity, description)
VALUES
('Oil Filter', 'Bosch', 'OF-1234', 4500.00, 30, 'Standard oil filter'),
('Brake Pad Set (Front)', 'Brembo', 'BP-FORD-01', 32000.00, 12, 'Front brake pads'),
('Performance Air Filter', 'K&N', 'KN-33-2865', 18000.00, 5, 'High-flow air filter');

INSERT INTO service_log
(car_id, performed_by, service_date, description)
VALUES
(1, 3, '2024-03-15', 'Annual service, oil and filter change'),
(2, 3, '2024-06-02', 'Pre-tuning inspection'),
(3, 3, '2024-01-20', 'Brake replacement');

INSERT INTO service_part
(service_id, part_id, quantity, unit_price)
VALUES
(1, 1, 1, 4500.00),
(3, 2, 1, 32000.00),
(2, 3, 1, 18000.00);

GO