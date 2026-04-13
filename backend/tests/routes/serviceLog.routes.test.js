const request = require('supertest');
const express = require('express');
const serviceLogRoutes = require('../../src/routes/serviceLog.routes');
const serviceLogController = require('../../src/controllers/serviceLog.controller');
const authMiddleware = require('../../src/middleware/auth.middleware');

jest.mock('../../src/controllers/serviceLog.controller');
jest.mock('../../src/middleware/auth.middleware');

const app = express();
app.use(express.json());
app.use('/service-logs', serviceLogRoutes);

describe('ServiceLog Routes Unit Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        
        authMiddleware.verifyToken.mockImplementation((req, res, next) => {
            req.user = { user_id: 10, is_admin: false };
            next();
        });

        
        authMiddleware.verifyAdmin.mockImplementation((req, res, next) => {
            if (req.user && req.user.is_admin) {
                next();
            } else {
                res.status(403).json({ error: "Admin hozzáférés szükséges" });
            }
        });
    });

    

    describe('GET /service-logs/my', () => {
        it('Sikeres lekérés bejelentkezett felhasználóként', async () => {
            serviceLogController.getMyServiceLogs.mockImplementation((req, res) => res.status(200).json([]));
            const res = await request(app).get('/service-logs/my');
            
            expect(res.statusCode).toBe(200);
            expect(authMiddleware.verifyToken).toHaveBeenCalled();
            expect(serviceLogController.getMyServiceLogs).toHaveBeenCalled();
        });
    });

    describe('GET /service-logs & /service-logs/:id', () => {
        it('Az összes napló listázása elérhető sima usernek is', async () => {
            serviceLogController.getAllServiceLogs.mockImplementation((req, res) => res.status(200).json([]));
            const res = await request(app).get('/service-logs');
            
            expect(res.statusCode).toBe(200);
            expect(serviceLogController.getAllServiceLogs).toHaveBeenCalled();
        });

        it('Egy konkrét napló lekérhető sima usernek is', async () => {
            serviceLogController.getServiceLogById.mockImplementation((req, res) => res.status(200).json({ id: 1 }));
            const res = await request(app).get('/service-logs/1');
            
            expect(res.statusCode).toBe(200);
            expect(serviceLogController.getServiceLogById).toHaveBeenCalled();
        });
    });

    describe('GET /service-logs/:id/comments', () => {
        it('A kommentek elérhetőek bejelentkezett felhasználóknak', async () => {
            serviceLogController.getServiceComments.mockImplementation((req, res) => res.status(200).json([]));
            const res = await request(app).get('/service-logs/1/comments');
            
            expect(res.statusCode).toBe(200);
            expect(serviceLogController.getServiceComments).toHaveBeenCalled();
        });
    });

    

    describe('PUT /service-logs/:id', () => {
        it('Módosítás tiltása sima felhasználónak', async () => {
            const res = await request(app).put('/service-logs/1').send({ status: 'completed' });
            expect(res.statusCode).toBe(403);
        });

        it('Módosítás engedélyezése Adminnak', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: 1, is_admin: true };
                next();
            });
            serviceLogController.updateServiceLog.mockImplementation((req, res) => res.status(200).json({ updated: true }));

            const res = await request(app).put('/service-logs/1').send({ status: 'completed' });
            expect(res.statusCode).toBe(200);
        });
    });

    describe('DELETE /service-logs/:id', () => {
        it('Törlés tiltása sima felhasználónak', async () => {
            const res = await request(app).delete('/service-logs/1');
            expect(res.statusCode).toBe(403);
        });

        it('Törlés engedélyezése Adminnak', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: 1, is_admin: true };
                next();
            });
            serviceLogController.deleteServiceLog.mockImplementation((req, res) => res.status(200).json({ deleted: true }));

            const res = await request(app).delete('/service-logs/1');
            expect(res.statusCode).toBe(200);
        });
    });

    

    describe('Global Authentication Check', () => {
        it('Edge Case: Minden útvonal 401-et ad, ha nincs érvényes token', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                res.status(401).json({ error: "Nincs bejelentkezve" });
            });

            const endpoints = [
                { method: 'get', url: '/service-logs/my' },
                { method: 'post', url: '/service-logs' },
                { method: 'get', url: '/service-logs' },
                { method: 'put', url: '/service-logs/1' },
                { method: 'delete', url: '/service-logs/1' }
            ];

            for (const endpoint of endpoints) {
                const res = await request(app)[endpoint.method](endpoint.url);
                expect(res.statusCode).toBe(401);
            }
        });
    });
});