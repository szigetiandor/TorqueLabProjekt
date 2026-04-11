const request = require('supertest');
const express = require('express');
const carRoutes = require('../../src/routes/car.routes');
const carController = require('../../src/controllers/car.controller');


jest.mock('../../src/controllers/car.controller');

const app = express();
app.use(express.json());
app.use('/cars', carRoutes);

describe('Car Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /cars', () => {
    it('meg kell hívnia a carController.createCar-t', async () => {
      carController.createCar.mockImplementation((req, res) => res.status(201).json({ id: 1 }));

      const res = await request(app)
        .post('/cars')
        .send({ brand: 'Audi', model: 'RS6' });

      expect(res.statusCode).toBe(201);
      expect(carController.createCar).toHaveBeenCalled();
    });
  });

  describe('GET /cars', () => {
    it('meg kell hívnia a carController.getAllCars-t', async () => {
      carController.getAllCars.mockImplementation((req, res) => res.status(200).json([]));

      const res = await request(app).get('/cars');

      expect(res.statusCode).toBe(200);
      expect(carController.getAllCars).toHaveBeenCalled();
    });
  });

  describe('GET /cars/:id', () => {
    it('meg kell hívnia a carController.getCarById-t a helyes ID-val', async () => {
      carController.getCarById.mockImplementation((req, res) => res.status(200).json({ id: req.params.id }));

      const res = await request(app).get('/cars/42');

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe('42');
      expect(carController.getCarById).toHaveBeenCalled();
    });
  });

  describe('PUT /cars/:id', () => {
    it('meg kell hívnia a carController.updateCar-t', async () => {
      carController.updateCar.mockImplementation((req, res) => res.status(200).json({ updated: true }));

      const res = await request(app)
        .put('/cars/42')
        .send({ price: 15000000 });

      expect(res.statusCode).toBe(200);
      expect(carController.updateCar).toHaveBeenCalled();
    });
  });

  describe('DELETE /cars/:id', () => {
    it('meg kell hívnia a carController.deleteCar-t', async () => {
      carController.deleteCar.mockImplementation((req, res) => res.status(200).json({ success: true }));

      const res = await request(app).delete('/cars/42');

      expect(res.statusCode).toBe(200);
      expect(carController.deleteCar).toHaveBeenCalled();
    });
  });
});