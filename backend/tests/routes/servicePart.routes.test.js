const request = require('supertest');
const express = require('express');
const servicePartRoutes = require('../../src/routes/servicePart.routes');
const servicePartController = require('../../src/controllers/servicePart.controller');
const authMiddleware = require('../../src/middleware/auth.middleware');

// Kontroller és Middleware mockolása
jest.mock('../../src/controllers/servicePart.controller');
jest.mock('../../src/middleware/auth.middleware');

const app = express();
app.use(express.json());
app.use('/service-parts', servicePartRoutes);

describe('ServicePart Routes & Security', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Alapértelmezett: A token valid, de nem admin
        authMiddleware.verifyToken.mockImplementation((req, res, next) => {
            req.user = { user_id: '123', is_admin: false };
            next();
        });

        authMiddleware.verifyAdmin.mockImplementation((req, res, next) => {
            if (req.user && req.user.is_admin) {
                next();
            } else {
                res.status(403).json({ error: "Admin access required" });
            }
        });
    });

    describe('GET /service-parts (Public Access)', () => {
        it('mindenki számára elérhető (Public)', async () => {
            servicePartController.getAllServiceParts.mockImplementation((req, res) => res.status(200).json([]));

            const res = await request(app).get('/service-parts');

            expect(res.statusCode).toBe(200);
            expect(servicePartController.getAllServiceParts).toHaveBeenCalled();
            // A tokent nem is kell ellenőrizni ennél a route-nál
            expect(authMiddleware.verifyToken).not.toHaveBeenCalled();
        });
    });

    describe('POST /service-parts (Admin Only)', () => {
        it('Sikeres rögzítés Admin jogosultsággal (201)', async () => {
            // Admin szimulálása
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: '1', is_admin: true };
                next();
            });
            servicePartController.createServicePart.mockImplementation((req, res) => res.status(201).json({ id: 10 }));

            const res = await request(app)
                .post('/service-parts')
                .send({ part_id: 1, service_id: 1, quantity: 2 });

            expect(res.statusCode).toBe(201);
            expect(servicePartController.createServicePart).toHaveBeenCalled();
        });
    });

    describe('PUT /service-parts/:id (Admin Only)', () => {
        it('Edge Case: Token hiánya esetén 401 (vagy middleware hiba)', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            });

            const res = await request(app).put('/service-parts/10').send({ quantity: 5 });

            expect(res.statusCode).toBe(401);
            expect(servicePartController.updateServicePart).not.toHaveBeenCalled();
        });

        it('Módosítás sikeres Adminisztrátorként', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: '1', is_admin: true };
                next();
            });
            servicePartController.updateServicePart.mockImplementation((req, res) => res.status(200).json({ success: true }));

            const res = await request(app).put('/service-parts/10').send({ quantity: 5 });

            expect(res.statusCode).toBe(200);
            expect(servicePartController.updateServicePart).toHaveBeenCalled();
        });
    });

    describe('DELETE /service-parts/:id', () => {
        it('Törlés elutasítva nem-admin felhasználónak', async () => {
            const res = await request(app).delete('/service-parts/10');

            expect(res.statusCode).toBe(403);
            expect(servicePartController.deleteServicePart).not.toHaveBeenCalled();
        });
    });
});