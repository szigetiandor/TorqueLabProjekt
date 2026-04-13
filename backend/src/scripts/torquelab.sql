USE MASTER;

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
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    for_sale BIT NOT NULL DEFAULT 0,
    owner_id INT NOT NULL,
    [description] VARCHAR(MAX),
    image_id INT,

    FOREIGN KEY (image_id) REFERENCES [image](image_id),
    FOREIGN KEY (owner_id) REFERENCES [user](user_id)
);

CREATE TABLE part (
    part_id INT IDENTITY PRIMARY KEY,
    [name] VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    part_number VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    [description] VARCHAR(255),
    discount_factor DECIMAL(5, 4) NOT NULL DEFAULT 1.0000,
     category VARCHAR(50) NOT NULL,

    CONSTRAINT CK_Valid_Discount
    CHECK (0.0000 <= discount_factor AND discount_factor <= 1.0000)
);

CREATE TABLE service_log (
    service_id INT IDENTITY PRIMARY KEY,
    car_id INT NOT NULL,
    performed_by INT,
    service_date DATE,
    [description] VARCHAR(255),
    [status] VARCHAR(20) NOT NULL DEFAULT 'Pending',

    FOREIGN KEY (car_id) REFERENCES car(car_id),
    FOREIGN KEY (performed_by) REFERENCES [user](user_id),

    CONSTRAINT CK_ServiceLog_Status
    CHECK ([status] IN ('Pending', 'In Progress', 'Awaiting Parts', 'Completed', 'Cancelled'))
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

-- Ez a tábla ahhoz kell, hogy a szervíz naplókhoz lehessen kötni megjegyzéseket
CREATE TABLE service_comment (
    service_comment_id INT IDENTITY PRIMARY KEY,
    by_user INT NOT NULL,
    service_id INT NOT NULL,
    comment VARCHAR(255) NOT NULL,

    FOREIGN KEY (service_id) REFERENCES service_log(service_id),
    FOREIGN KEY (by_user) REFERENCES [user](user_id)
);

CREATE TABLE [image] (
    image_id INT IDENTITY PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    by_user INT,

    FOREIGN KEY (by_user) REFERENCES [user](user_id)
);

GO

INSERT INTO [user] (name, email, password_hash, is_admin) VALUES
('Admin', 'admin@torquelab.hu', '$2a$10$Bk.ljIgH0ExxrxVtSb5TIO8qpEXld7kdTSaClw/Co09.uhujDaJPC', 1), -- password: 0123456789
('Teszt Elek', 'teszt@torquelab.hu', '$2a$10$Bk.ljIgH0ExxrxVtSb5TIO8qpEXld7kdTSaClw/Co09.uhujDaJPC', 0); -- password: 0123456789


INSERT INTO car
(vin, brand, model, production_year, engine, mileage, owner_id, description, for_sale, price)
VALUES
('WF0AXXWPMAG123456', 'Ford', 'Racing Puma', 2000, '1.7 Zetec-S VCT', 10000, 1,
 'Ez a Ford Racing Puma már gyárilag is különlegesség, de ez a példány egy átgondolt, pályára optimalizált build.

A gyári 1.7 Zetec-S VCT (FHBA) motor teljes felújításon esett át: kovácsolt dugattyúk, erősített hajtókarok és finomhangolt ECU került bele. A szívóoldalon egyedi portolt szívósor és sportlégszűrő dolgozik, míg a kipufogórendszer rozsdamentes, nagyobb átmérőjű leömlővel és sport katalizátorral készült. Az eredmény kb. 155–165 LE, ami egy ilyen könnyű kasztniban brutálisan élénk.

A futómű teljesen átalakított: állítható coilover szett (Bilstein/KW kategória), poliuretán szilentek, valamint megerősített stabilizátorok. A gyári Alcon fékrendszer felújítva, sport betétekkel és fémhálós fékcsövekkel.

A hajtásláncban a gyári sperrdifferenciál (LSD) mellé rövidebb áttételű váltó került, így még agresszívebb kigyorsításokra képes.'
, 1, 18000.00),


('1FA6P8TH0J5102345', 'Ford', 'GT (fehérholló)', 2006, '5.4l v8', 42000, 2,
 'Ez a Ford GT már alapból is szupersport kategória, de itt komoly teljesítménynövelés történt.

Az 5.4 literes kompresszoros V8 (Modular) motor kapott egy nagyobb teljesítményű Whipple kompresszort, egyedi ECU hangolást és nagy átfolyású befecskendezőket. A hűtésrendszer is fejlesztve lett (nagyobb intercooler), hogy stabilan kezelje a megnövelt teljesítményt. A teljesítmény így kb. 700–750 LE körül alakul.

A kipufogórendszer teljesen egyedi, titán hátsó dobokkal, brutális hanggal, de még utcán is használható.

A futómű finomhangolt: állítható lengéscsillapítók és módosított geometria, hogy nagy sebességnél is stabil maradjon. A fékek karbon-kerámia upgrade-et kaptak.

Külsőleg karbon elemek (splitter, diffuser) javítják az aerodinamikát.',
  1, 450000.00),


('WF0FXXGCDGJ987654', 'Ford', 'Mustang SVT Cobra', 2004, '4.6 V8 Supercharged', 120000, 1,
 'Ford Mustang SVT Cobra „Terminator” (2004) -- A utcai vadállat

A legendás Terminator Cobra itt egy brutális utcai géppé lett építve.

A gyári 4.6 V8 Supercharged (Y kód) motor kapott egy nagyobb 2.3L Whipple kompresszort, kovácsolt belsőt (dugattyúk, hajtókarok), valamint nagyobb üzemanyag-rendszert (pumpák, injektorok). Egyedi ECU hangolással a teljesítmény eléri a 600–650 LE-t.

A kipufogó teljesen átépített: hosszú leömlők, X-pipe és sport dobok – mély, agresszív hanggal.

A futómű: állítható coilover szett, megerősített hátsó híd és drag-spec féltengelyek, hogy bírja a brutális nyomatékot. A váltó megerősített kuplungot és rövidebb áttételezést kapott.

A fékrendszer nagyobb Brembo tárcsákkal és 4 dugattyús nyergekkel lett fejlesztve.',
  1, 45000.00);

INSERT INTO part
(name, manufacturer, part_number, price, stock_quantity, description, category)
VALUES
('Oil Filter', 'Bosch', 'OF-1234', 4500.00, 30, 'Standard oil filter', 'Engine'),
('Brake Pad Set (Front)', 'Brembo', 'BP-FORD-01', 32000.00, 12, 'Front brake pads', 'Brakes'),
('Performance Air Filter', 'K&N', 'KN-33-2865', 18000.00, 5, 'High-flow air filter', 'Engine');

INSERT INTO service_log
(car_id, performed_by, service_date, description)
VALUES
(1, 1, '2024-03-15', 'Annual service, oil and filter change'),
(2, 1, '2024-06-02', 'Pre-tuning inspection'),
(3, 1, '2024-01-20', 'Brake replacement');

INSERT INTO service_part
(service_id, part_id, quantity, unit_price)
VALUES
(1, 1, 1, 4500.00),
(3, 2, 1, 32000.00),
(2, 3, 1, 18000.00);

INSERT INTO service_comment (by_user, service_id, comment) VALUES
(1, 1, 'Found a small coolant leak, monitored for next visit.'),
(1, 2, 'Car feels much smoother after the fresh oil!'),
(1, 3, 'Waiting for the Akrapovic system to arrive from the supplier.');

GO

