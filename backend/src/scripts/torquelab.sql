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
    price DECIMAL(15,2),         
    imageUrl VARCHAR(500),       
    [description] VARCHAR(MAX),  
    build_type VARCHAR(50),      
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

-- Teszt adatok feltöltése
INSERT INTO [user] (name, email, password_hash, is_admin) VALUES
('John Doe', 'john.doe@email.com', 'hash', 0),
('Mike Johnson', 'mike@torquelab.com', 'hash', 1);

INSERT INTO car (vin, brand, model, production_year, engine, mileage, price, build_type, [description], owner_id) VALUES
('WF0AXXWPMAG123', 'Ford', 'Focus RS', 2018, '2.3 EcoBoost', 45000, 14500000, 'street', 'Stage 2 tuning, Mountune intercooler, kiváló állapot.', 1),
('1FA6P8TH0J5102', 'Ford', 'Mustang GT', 2020, '5.0 V8', 12000, 22000000, 'track', 'Track-spec felfüggesztés, Brembo fékek, pályára kész.', 2),
('WF0FXXGCDGJ987', 'Ford', 'Fiesta ST', 2019, '1.5 EcoBoost', 35000, 8900000, 'street', 'Napi használatból, frissen szervizelve.', 1);