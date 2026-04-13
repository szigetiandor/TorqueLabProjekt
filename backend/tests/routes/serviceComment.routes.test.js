const request = require('supertest');
const express = require('express');
const serviceCommentRoutes = require('../../src/routes/serviceComment.routes');
const serviceCommentController = require('../../src/controllers/serviceComment.controller');
const authMiddleware = require('../../src/middleware/auth.middleware');

jest.mock('../../src/controllers/serviceComment.controller');
jest.mock('../../src/middleware/auth.middleware');

const app = express();
app.use(express.json());
app.use('/service-comments', serviceCommentRoutes);

describe('ServiceComment Routes & Authorization', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        
        
        authMiddleware.verifyToken.mockImplementation((req, res, next) => {
            req.user = { user_id: 'user123', is_admin: false };
            next();
        });

        authMiddleware.verifyAdmin.mockImplementation((req, res, next) => {
            if (req.user && req.user.is_admin) {
                next();
            } else {
                res.status(403).json({ error: "Forbidden: Admin access required" });
            }
        });
    });

    describe('GET /service-comments (Bejelentkezett user)', () => {
        it('Sikeres lekérés bármilyen bejelentkezett felhasználónak', async () => {
            serviceCommentController.getAllServiceComments.mockImplementation((req, res) => 
                res.status(200).json([{ id: 1, comment: 'Test comment' }])
            );

            const res = await request(app).get('/service-comments');

            expect(res.statusCode).toBe(200);
            expect(authMiddleware.verifyToken).toHaveBeenCalled();
            expect(serviceCommentController.getAllServiceComments).toHaveBeenCalled();
        });

        it('Edge Case: Elutasítás, ha nincs token', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                res.status(401).json({ error: "Unauthorized" });
            });

            const res = await request(app).get('/service-comments');

            expect(res.statusCode).toBe(401);
            expect(serviceCommentController.getAllServiceComments).not.toHaveBeenCalled();
        });
    });

    describe('POST /service-comments (Admin Only)', () => {
        it('Edge Case: Sima felhasználó nem hozhat létre kommentet (403)', async () => {
            const res = await request(app)
                .post('/service-comments')
                .send({ service_id: 1, comment: 'Admin comment only' });

            expect(res.statusCode).toBe(403);
            expect(serviceCommentController.createServiceComment).not.toHaveBeenCalled();
        });

        it('Sikeres létrehozás Admin fiókkal', async () => {
            
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: 'admin1', is_admin: true };
                next();
            });
            serviceCommentController.createServiceComment.mockImplementation((req, res) => 
                res.status(201).json({ success: true })
            );

            const res = await request(app)
                .post('/service-comments')
                .send({ service_id: 1, comment: 'I am admin' });

            expect(res.statusCode).toBe(201);
            expect(serviceCommentController.createServiceComment).toHaveBeenCalled();
        });
    });

    describe('PUT & DELETE /service-comments/:id (Admin Only)', () => {
        it('Módosítás elutasítása sima felhasználótól', async () => {
            const res = await request(app)
                .put('/service-comments/1')
                .send({ comment: 'Modified' });

            expect(res.statusCode).toBe(403);
            expect(serviceCommentController.updateServiceComment).not.toHaveBeenCalled();
        });

        it('Törlés elutasítása sima felhasználótól', async () => {
            const res = await request(app).delete('/service-comments/1');

            expect(res.statusCode).toBe(403);
            expect(serviceCommentController.deleteServiceComment).not.toHaveBeenCalled();
        });

        it('Sikeres törlés Adminisztrátorként', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: 'admin1', is_admin: true };
                next();
            });
            serviceCommentController.deleteServiceComment.mockImplementation((req, res) => 
                res.status(200).json({ message: 'Deleted' })
            );

            const res = await request(app).delete('/service-comments/1');

            expect(res.statusCode).toBe(200);
            expect(serviceCommentController.deleteServiceComment).toHaveBeenCalled();
        });
    });
});