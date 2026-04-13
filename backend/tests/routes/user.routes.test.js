const request = require('supertest');
const express = require('express');
const userRoutes = require('../../src/routes/user.routes');
const userController = require('../../src/controllers/user.controller');
const authMiddleware = require('../../src/middleware/auth.middleware');

jest.mock('../../src/controllers/user.controller');
jest.mock('../../src/middleware/auth.middleware');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('Protected User Routes', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        
        authMiddleware.verifyToken.mockImplementation((req, res, next) => {
            req.user = { user_id: '5', is_admin: false }; 
            next();
        });
        authMiddleware.verifyAdmin.mockImplementation((req, res, next) => {
            if (req.user && req.user.is_admin) next();
            else res.status(403).json({ error: "Admin access required" });
        });
    });

    describe('POST /users', () => {
        it('Publikus útvonal: token nélkül is elérhető', async () => {
            userController.createUser.mockImplementation((req, res) => res.status(201).json({ id: 1 }));

            const res = await request(app)
                .post('/users')
                .send({ name: 'Teszt Elek', email: 't@t.hu', password: 'password123' });

            expect(res.statusCode).toBe(201);
            expect(userController.createUser).toHaveBeenCalled();
        });
    });

    describe('GET /users (Admin Only)', () => {
        it('Sikeres lekérés Admin jogosultsággal', async () => {
            
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: '1', is_admin: true };
                next();
            });
            userController.getAllUsers.mockImplementation((req, res) => res.status(200).json([]));

            const res = await request(app).get('/users');

            expect(res.statusCode).toBe(200);
            expect(userController.getAllUsers).toHaveBeenCalled();
        });

        it('Hiba: Sima felhasználó nem listázhat (403)', async () => {
            
            const res = await request(app).get('/users');

            expect(res.statusCode).toBe(403);
            expect(userController.getAllUsers).not.toHaveBeenCalled();
        });
    });

    describe('GET /users/:id (Token required)', () => {
        it('Sikeres lekérés érvényes tokennel', async () => {
            userController.getUserById.mockImplementation((req, res) => res.status(200).json({ id: '5' }));

            const res = await request(app).get('/users/5');

            expect(res.statusCode).toBe(200);
            expect(authMiddleware.verifyToken).toHaveBeenCalled();
            expect(userController.getUserById).toHaveBeenCalled();
        });

        it('Hiba: Token hiánya esetén elutasít (401/403)', async () => {
            
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                res.status(401).json({ error: "No token provided" });
            });

            const res = await request(app).get('/users/5');

            expect(res.statusCode).toBe(401);
            expect(userController.getUserById).not.toHaveBeenCalled();
        });
    });

    describe('DELETE /users/:id (Admin required)', () => {
        it('Hiba: Sima user nem törölhet felhasználót', async () => {
            const res = await request(app).delete('/users/10');

            expect(res.statusCode).toBe(403);
            expect(userController.deleteUser).not.toHaveBeenCalled();
        });

        it('Sikeres törlés Admin jogosultsággal', async () => {
            authMiddleware.verifyToken.mockImplementation((req, res, next) => {
                req.user = { user_id: '1', is_admin: true };
                next();
            });
            userController.deleteUser.mockImplementation((req, res) => res.status(200).json({ deleted: true }));

            const res = await request(app).delete('/users/10');

            expect(res.statusCode).toBe(200);
            expect(userController.deleteUser).toHaveBeenCalled();
        });
    });
});