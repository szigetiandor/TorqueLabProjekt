const request = require('supertest');
const express = require('express');
const partRoutes = require('../../src/routes/part.routes');
const partController = require('../../src/controllers/part.controller');
const authMiddleware = require('../../src/middleware/auth.middleware');

jest.mock('../../src/controllers/part.controller');
jest.mock('../../src/middleware/auth.middleware');

const app = express();
app.use(express.json());
app.use('/parts', partRoutes);

describe('Part Routes Unit Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        
        authMiddleware.verifyToken.mockImplementation((req, res, next) => {
            req.user = { user_id: 100, is_admin: false };
            next();
        });

        
        authMiddleware.verifyAdmin.mockImplementation((req, res, next) => {
            if (req.user && req.user.is_admin) {
                next();
            } else {
                res.status(403).json({ error: "Admin jogosultság szükséges" });
            }
        });
    });

    

    describe('GET /parts', () => {
        test('Összes alkatrész listázása - Token nélkül is elérhető (Public)', async () => {
            partController.getAllParts.mockImplementation((req, res) => res.status(200).json([]));

            const res = await request(app).get('/parts');

            expect(res.statusCode).toBe(200);
            expect(partController.getAllParts).toHaveBeenCalled();
            
            expect(authMiddleware.verifyToken).not.toHaveBeenCalled();
        });

        test('Egy alkatrész lekérése ID alapján - Token nélkül is elérhető (Public)', async () => {
            partController.getPartById.mockImplementation((req, res) => res.status(200).json({ id: 1, name: 'Fékbetét' }));

            const res = await request(app).get('/parts/1');

            expect(res.statusCode).toBe(200);
            expect(partController.getPartById).toHaveBeenCalled();
        });
    });

    

    describe('POST /parts (Admin Only)', () => {
        test('Edge Case: Sima felhasználó (nem admin) elutasítása (403)', async () => {
            const res = await request(app)
                .post('/parts')
                .send({ name: 'Új alkatrész', price: 5000 });

            expect(res.statusCode).toBe(403);
            expect(partController.createPart).not.toHaveBeenCalled();
        });

        test('Sikeres létrehozás Admin fiókkal (201)', async () => {
            
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: 1, is_admin: true };
                next();
            });
            partController.createPart.mockImplementation((req, res) => res.status(201).json({ id: 99 }));

            const res = await request(app)
                .post('/parts')
                .send({ name: 'Admin alkatrész', price: 10000 });

            expect(res.statusCode).toBe(201);
            expect(partController.createPart).toHaveBeenCalled();
        });
    });

    describe('PUT /parts/:id (Admin Only)', () => {
        test('Módosítás tiltása sima felhasználónak (403)', async () => {
            const res = await request(app)
                .put('/parts/1')
                .send({ stock: 50 });

            expect(res.statusCode).toBe(403);
            expect(partController.updatePart).not.toHaveBeenCalled();
        });

        test('Sikeres módosítás Admin fiókkal (200)', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: 1, is_admin: true };
                next();
            });
            partController.updatePart.mockImplementation((req, res) => res.status(200).json({ updated: true }));

            const res = await request(app).put('/parts/1').send({ stock: 50 });

            expect(res.statusCode).toBe(200);
            expect(partController.updatePart).toHaveBeenCalled();
        });
    });

    describe('DELETE /parts/:id (Admin Only)', () => {
        test('Törlés elutasítása érvénytelen vagy hiányzó token esetén (401)', async () => {
            
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Érvénytelen token" });
            });

            const res = await request(app).delete('/parts/1');

            expect(res.statusCode).toBe(401);
            expect(partController.deletePart).not.toHaveBeenCalled();
        });

        test('Sikeres törlés Admin fiókkal', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: 1, is_admin: true };
                next();
            });
            partController.deletePart.mockImplementation((req, res) => res.status(200).json({ deleted: true }));

            const res = await request(app).delete('/parts/1');

            expect(res.statusCode).toBe(200);
            expect(partController.deletePart).toHaveBeenCalled();
        });
    });
});