const request = require('supertest');
const express = require('express');
const carRoutes = require('../../src/routes/car.routes');
const carController = require('../../src/controllers/car.controller');
const authMiddleware = require('../../src/middleware/auth.middleware');

jest.mock('../../src/controllers/car.controller');
jest.mock('../../src/middleware/auth.middleware');

const app = express();
app.use(express.json());
app.use('/cars', carRoutes);

describe('Car Routes Unit Tests with Auth Mocking', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        
        authMiddleware.verifyToken.mockImplementation((req, res, next) => {
            req.user = { user_id: 10, is_admin: false };
            next();
        });
    });

    describe('GET /cars & /cars/:id (Public Access)', () => {
        test('GET /cars - Token nélkül is elérhető', async () => {
            carController.getAllCars.mockImplementation((req, res) => res.status(200).json([]));

            const res = await request(app).get('/cars');

            expect(res.statusCode).toBe(200);
            expect(carController.getAllCars).toHaveBeenCalled();
            
            expect(authMiddleware.verifyToken).not.toHaveBeenCalled();
        });

        test('GET /cars/:id - Publikusan megtekinthető', async () => {
            carController.getCarById.mockImplementation((req, res) => res.status(200).json({ id: 1 }));

            const res = await request(app).get('/cars/1');

            expect(res.statusCode).toBe(200);
            expect(carController.getCarById).toHaveBeenCalled();
        });
    });

    describe('POST /cars (Protected)', () => {
        test('Sikeres rögzítés érvényes tokennel', async () => {
            carController.createCar.mockImplementation((req, res) => res.status(201).json({ id: 1 }));

            const res = await request(app)
                .post('/cars')
                .send({ brand: 'BMW', model: 'M3' });

            expect(res.statusCode).toBe(201);
            expect(authMiddleware.verifyToken).toHaveBeenCalled();
            expect(carController.createCar).toHaveBeenCalled();
        });

        test('Edge Case: Elutasítás, ha a verifyToken hibát dob (401)', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Invalid token" });
            });

            const res = await request(app).post('/cars').send({});

            expect(res.statusCode).toBe(401);
            
            expect(carController.createCar).not.toHaveBeenCalled();
        });
    });

    describe('PUT & DELETE /cars/:id (Protected)', () => {
        test('PUT - Token ellenőrzés lefut módosítás előtt', async () => {
            carController.updateCar.mockImplementation((req, res) => res.status(200).json({ updated: true }));

            const res = await request(app).put('/cars/1').send({ mileage: 50000 });

            expect(res.statusCode).toBe(200);
            expect(authMiddleware.verifyToken).toHaveBeenCalled();
        });

        test('DELETE - Token ellenőrzés lefut törlés előtt', async () => {
            carController.deleteCar.mockImplementation((req, res) => res.status(200).json({ message: "Deleted" }));

            const res = await request(app).delete('/cars/1');

            expect(res.statusCode).toBe(200);
            expect(authMiddleware.verifyToken).toHaveBeenCalled();
            expect(carController.deleteCar).toHaveBeenCalled();
        });

        test('Edge Case: DELETE token nélkül (401)', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Token required" });
            });

            const res = await request(app).delete('/cars/1');

            expect(res.statusCode).toBe(401);
            expect(carController.deleteCar).not.toHaveBeenCalled();
        });
    });
});