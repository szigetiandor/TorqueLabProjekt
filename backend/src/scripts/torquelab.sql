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
    [image_filename] VARCHAR(255),
    [description] VARCHAR(MAX),

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
    [image_filename] VARCHAR(255),

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
(vin, brand, model, production_year, engine, mileage, owner_id, [description], for_sale, price, image_filename)
VALUES
('WF0AXXWPMAG123111', 'Ford', 'Racing Puma', 2000, '1.7 Zetec-S VCT', 10000, 1,
 'A Ford Racing Puma már gyárilag is különlegesség, de ez a példány egy átgondolt, pályára optimalizált build.

A gyári 1.7 Zetec-S VCT (FHBA) motor teljes felújításon esett át: kovácsolt dugattyúk, erősített hajtókarok és finomhangolt ECU került bele. A szívóoldalon egyedi titánium szívósor és sportlégszűrő dolgozik, míg a kipufogórendszer rozsdamentes, nagyobb átmérőjű leömlővel és sport katalizátorral készült. Az eredmény kb. 155–165 LE, ami egy ilyen könnyű kasztniban brutálisan élénk.

A futómű állítható, poliuretán szilentek, valamint megerősített stabilizátorok. A gyári Alcon fékrendszer felújítva, sport betétekkel és fémhálós fékcsövekkel.'
, 1, 10000000.00,'puma.png'),


('1FA6P8TH0J5102322', 'Ford', 'GT', 2006, '5.4l v8', 42000, 2,
 'A Ford GT már alapból is szupersport kategória, de itt komoly teljesítménynövelés történt.

Az 5.4 literes kompresszoros V8 (Modular) motor kapott egy nagyobb teljesítményű Whipple kompresszort, egyedi ECU hangolást és nagy átfolyású befecskendezőket. A hűtésrendszer is fejlesztve lett (nagyobb intercooler), hogy stabilan kezelje a megnövelt teljesítményt. A teljesítmény így kb. 700–750 LE körül alakul.

A kipufogórendszer teljesen egyedi, titán hátsó dobokkal, brutális hanggal, de még utcán is használható.

A futómű állítható lengéscsillapítók és módosított geometria, hogy nagy sebességnél is stabil maradjon. A fékek karbon-kerámia upgrade-et kaptak.

Külsőleg karbon elemek javítják az aerodinamikát.',
  1, 45000000.00,'gt.jpg'),


('WF0FXXGCDGJ987633', 'Ford', 'Mustang SVT Cobra', 2004, '4.6 V8 Supercharged', 120000, 1,
 'Ford Mustang SVT Cobra „Terminator” (2004) 

A legendás Terminator Cobra itt egy brutális utcai géppé lett építve.

A gyári 4.6 V8 Supercharged (Y kód) motor kapott egy nagyobb 2.3L Whipple kompresszort, kovácsolt belsőt (dugattyúk, hajtókarok), valamint nagyobb üzemanyag-rendszert (pumpák, injektorok). Egyedi ECU hangolással a teljesítmény eléri a 600–650 LE-t.

A kipufogó teljesen átépített: hosszú leömlők, X-pipe és sport dobok – mély, agresszív hanggal.

A futómű: állítható coilover szett, megerősített hátsó híd és drag-spec féltengelyek, hogy bírja a brutális nyomatékot. A váltó megerősített kuplungot és rövidebb áttételezést kapott.

A fékrendszer nagyobb Brembo tárcsákkal és 4 dugattyús nyergekkel lett fejlesztve.',
  1, 20000000.00,'hollo.jpg');

INSERT INTO part
(name, manufacturer, part_number, price, stock_quantity, [description], category, image_filename)
VALUES
-- Engine
('Olajszűrő', 'Bosch', 'OF-1234', 4500.00, 30, 'Szabványos olajszűrő', 'Engine', 'engine_oil_filter.jpg'),
('Teljesítmény légszűrő', 'K&N', 'KN-33-2865', 18000.00, 5, 'Nagy áteresztőképességű légszűrő', 'Engine', 'engine_air_filter.jpg'),
('Gyújtógyertya készlet', 'NGK', 'NGK-7788', 12000.00, 20, '4 darabos gyújtógyertya készlet', 'Engine', 'engine_spark_plug.jpg'),

-- Brakes
('Féktárcsa (első)', 'ATE', 'ATE-54-789', 28000.00, 8, 'Első féktárcsa', 'Brakes', 'brake_disc.jpg'),
('Fékbetét készlet (hátsó)', 'Textar', 'TXT-8899', 22000.00, 10, 'Hátsó fékbetétek', 'Brakes', 'brake_pads_rear.jpg'),

-- Suspension
('Rugókészlet', 'Eibach', 'EIB-SPORT', 60000.00, 6, 'Sport rugókészlet', 'Suspension', 'suspension_springs.jpg'),
('Stabilizátor rúd', 'Febi', 'FEB-1122', 14000.00, 15, 'Első stabilizátor rúd', 'Suspension', 'suspension_stabilizer.jpg'),

-- Exhaust
('Kipufogó dob', 'Walker', 'WAL-9988', 22000.00, 7, 'Hátsó kipufogó dob', 'Exhaust', 'exhaust_muffler.jpg'),
('Sport kipufogó rendszer', 'Akrapovic', 'AKR-777', 350000.00, 2, 'Teljes sport kipufogó rendszer', 'Exhaust', 'exhaust_system.jpg'),
('Katalizátor', 'Bosal', 'BOS-3344', 90000.00, 4, 'Katalizátor egység', 'Exhaust', 'exhaust_catalyst.jpg'),

-- Body
('Első lökhárító', 'OEM', 'BODY-111', 85000.00, 3, 'Első lökhárító elem', 'Body', 'body_fender.jpg');

INSERT INTO service_log
(car_id, performed_by, service_date, [description])
VALUES
(1, 1, '2024-03-15', 'Éves szerviz, olaj- és szűrőcsere'),
(2, 1, '2024-06-02', 'Tuning előtti átvizsgálás'),
(3, 1, '2024-01-20', 'Fékcsere');

INSERT INTO service_part
(service_id, part_id, quantity, unit_price)
VALUES
(1, 1, 1, 4500.00),
(3, 4, 1, 28000.00),
(2, 2, 1, 18000.00);

INSERT INTO service_comment (by_user, service_id, comment) VALUES
(1, 1, 'Kisebb hűtőfolyadék szivárgás találva, következő alkalommal ellenőrizni.'),
(1, 2, 'Az autó sokkal simábban működik az új olaj után!'),
(1, 3, 'Várjuk az Akrapovic rendszer érkezését a beszállítótól.');

GO