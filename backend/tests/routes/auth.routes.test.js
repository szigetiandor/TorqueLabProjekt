const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth.routes'); 
const authController = require('../../src/controllers/auth.controller');
const userController = require('../../src/controllers/user.controller');
const authMiddleware = require('../../src/middleware/auth.middleware');


jest.mock('../../src/controllers/auth.controller');
jest.mock('../../src/controllers/user.controller');
jest.mock('../../src/middleware/auth.middleware');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    
    authMiddleware.verifyToken.mockImplementation((req, res, next) => next());
    authMiddleware.verifyAdmin.mockImplementation((req, res, next) => next());
  });

  describe('POST /auth/login', () => {
    it('meg kell hívnia az authController.login-t', async () => {
      authController.login.mockImplementation((req, res) => res.status(200).json({ ok: true }));
      
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.hu', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(authController.login).toHaveBeenCalled();
    });
  });

  describe('POST /auth/register', () => {
    it('meg kell hívnia a userController.createUser-t', async () => {
      userController.createUser.mockImplementation((req, res) => res.status(201).json({ id: 1 }));

      const res = await request(app)
        .post('/auth/register')
        .send({ name: 'Teszt Elek', email: 'test@test.hu', password: 'nagyonhosszupassword' });

      expect(res.statusCode).toBe(201);
      expect(userController.createUser).toHaveBeenCalled();
    });
  });

  describe('Védett útvonalak ellenőrzése', () => {
    it('/verify-login-nak használnia kell a verifyToken middleware-t', async () => {
      authController.verifyLogin.mockImplementation((req, res) => res.status(200).json({ valid: true }));

      await request(app).post('/auth/verify-login');

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authController.verifyLogin).toHaveBeenCalled();
    });

    it('/verify-admin-nak használnia kell mindkét auth middleware-t', async () => {
      authController.verifyAdmin.mockImplementation((req, res) => res.status(200).json({ isAdmin: true }));

      await request(app).post('/auth/verify-admin');

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authMiddleware.verifyAdmin).toHaveBeenCalled();
      expect(authController.verifyAdmin).toHaveBeenCalled();
    });
  });

  describe('Biztonsági teszt (Middleware hiba)', () => {
    it('nem hívhatja meg a kontrollert, ha a verifyToken hibát dob', async () => {
      
      authMiddleware.verifyToken.mockImplementation((req, res, next) => {
        return res.status(401).json({ error: 'Unauthorized' });
      });

      const res = await request(app).post('/auth/become-admin');

      expect(res.statusCode).toBe(401);
      expect(authController.becomeAdmin).not.toHaveBeenCalled();
    });
  });
});