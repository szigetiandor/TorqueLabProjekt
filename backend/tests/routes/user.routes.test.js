const request = require('supertest');
const express = require('express');
const userRoutes = require('../../src/routes/user.routes');
const userController = require('../../src/controllers/user.controller');


jest.mock('../../src/controllers/user.controller');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('meghívja a createUser kontrollert', async () => {
      userController.createUser.mockImplementation((req, res) => res.status(201).json({ id: 1 }));

      const res = await request(app)
        .post('/users')
        .send({ name: 'Teszt Admin', email: 'admin@torquelab.hu', password: 'password12345' });

      expect(res.statusCode).toBe(201);
      expect(userController.createUser).toHaveBeenCalled();
    });
  });

  describe('GET /users', () => {
    it('meghívja a getAllUsers kontrollert', async () => {
      userController.getAllUsers.mockImplementation((req, res) => res.status(200).json([]));

      const res = await request(app).get('/users');

      expect(res.statusCode).toBe(200);
      expect(userController.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('GET /users/:id', () => {
    it('meghívja a getUserById kontrollert', async () => {
      userController.getUserById.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

      const res = await request(app).get('/users/5');

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe('5');
      expect(userController.getUserById).toHaveBeenCalled();
    });
  });

  describe('PUT /users/:id', () => {
    it('meghívja az updateUser kontrollert', async () => {
      userController.updateUser.mockImplementation((req, res) => res.status(200).json({ updated: true }));

      const res = await request(app)
        .put('/users/5')
        .send({ name: 'Módosított Név' });

      expect(res.statusCode).toBe(200);
      expect(userController.updateUser).toHaveBeenCalled();
    });
  });

  describe('DELETE /users/:id', () => {
    it('meghívja a deleteUser kontrollert', async () => {
      userController.deleteUser.mockImplementation((req, res) => res.status(200).json({ success: true }));

      const res = await request(app).delete('/users/5');

      expect(res.statusCode).toBe(200);
      expect(userController.deleteUser).toHaveBeenCalled();
    });
  });
});